import { Injectable } from '@nestjs/common'
import { EnvService } from '../../../infra/env/env.service'
import { Either, left, right } from '../../../core/either'
import { ResourceNotFound } from '../../../core/errors/resource-not-found'

export type CheckConnectionStatusRequest = {
  instanceName: string
}

export type CheckConnectionStatusResponse = Either<
  ResourceNotFound,
  {
    status: string
  }
>

@Injectable()
export class CheckConnectionStatusUseCase {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(private readonly envService: EnvService) {
    this.apiKey = this.envService.getApiKey()
    this.baseUrl = this.envService.getBaseUrl()
  }

  async execute({
    instanceName,
  }: CheckConnectionStatusRequest): Promise<CheckConnectionStatusResponse> {
    try {
      const response = await this.checkConnectionStatus(instanceName)
      return right({ status: response.instance.state })
    } catch (error) {
      return left(new ResourceNotFound('Failed to check connection status'))
    }
  }

  private async checkConnectionStatus(instanceName: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/instance/connectionState/${instanceName}`,
      {
        method: 'GET',
        headers: {
          apikey: this.apiKey,
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to check connection status')
    }

    return response.json()
  }
}
