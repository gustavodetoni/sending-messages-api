import { Injectable } from '@nestjs/common'
import { Instance } from '@/domain/enterprise/entities/instance'
import { UniqueEntityID } from '../../../core/entities/unique-entity-id'
import { EnvService } from '../../../infra/env/env.service'
import { Either, left, right } from '../../../core/either'
import { ResourceNotFound } from '../../../core/errors/resource-not-found'

interface CreateAndConnectInstanceRequest {
  instanceName: string
}

type CreateAndConnectInstanceResponse = Either<
  ResourceNotFound,
  {
    instance: Instance
    qrcode: string
  }
>

@Injectable()
export class CreateAndConnectInstanceUseCase {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(
    private readonly envService: EnvService,
  ) {
    this.apiKey = this.envService.getApiKey()
    this.baseUrl = this.envService.getBaseUrl()
  }

  async execute({ instanceName }: CreateAndConnectInstanceRequest): Promise<CreateAndConnectInstanceResponse> {
    try {
      const createResponse = await this.createInstance(instanceName)
      const instance = Instance.create({
        name: instanceName,
        qrCode: createResponse.qrcode,
        connectionStatus: 'created',
      }, new UniqueEntityID(createResponse.id))

      return right({
        instance,
        qrcode: createResponse.qrcode,
      })
    } catch (error) {
      return left(new ResourceNotFound('Failed to create and connect instance'))
    }
  }

  private async createInstance(instanceName: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/instance/create`, {
      method: 'POST',
      headers: {
        'apikey': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create instance')
    }

    return response.json()
  }
}
