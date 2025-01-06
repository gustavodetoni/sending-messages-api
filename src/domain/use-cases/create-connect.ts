import { Injectable } from '@nestjs/common'
import { Instance } from '../enterprise/entities/instance'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { EnvService } from 'src/infra/env/env.service'

export type CreateAndConnectInstanceRequest = {
  instanceName: string
}

export type CreateAndConnectInstanceResponse = {
  instance: Instance
  connectResponse: any
  connectionState: any
}

@Injectable()
export class CreateAndConnectInstanceUseCase {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(private readonly envService: EnvService) {
    this.apiKey = this.envService.getApiKey()
    this.baseUrl = this.envService.getBaseUrl()
  }

  async execute({
    instanceName,
  }: CreateAndConnectInstanceRequest): Promise<CreateAndConnectInstanceResponse> {
    const createResponse = await this.createInstance(instanceName)
    const instance = Instance.create(
      {
        name: instanceName,
        qrCode: createResponse.qrCode,
        connectionStatus: 'created',
      },
      new UniqueEntityID(createResponse.id),
    )

    const connectResponse = await this.connectInstance(instanceName)
    instance.updateQRCode(connectResponse.code)

    const connectionState = await this.getConnectionState(instanceName)
    instance.updateConnectionStatus(connectionState.instance.state)

    return {
      instance,
      connectResponse,
      connectionState,
    }
  }

  private async createInstance(instanceName: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/instance/create`, {
      method: 'POST',
      headers: {
        apikey: this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ instanceName }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create instance: ${response.statusText}`)
    }

    return response.json()
  }

  private async connectInstance(instanceName: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/instance/connect/${instanceName}`,
      {
        method: 'GET',
        headers: { apikey: this.apiKey },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to connect instance: ${response.statusText}`)
    }

    return response.json()
  }

  private async getConnectionState(instanceName: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/instance/connectionState/${instanceName}`,
      {
        method: 'GET',
        headers: { apikey: this.apiKey },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to get connection state: ${response.statusText}`)
    }

    return response.json()
  }
}
