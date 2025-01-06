import { Injectable } from '@nestjs/common'
import { EnvService } from '../../../infra/env/env.service'
import { Either, left, right } from '../../../core/either'
import { ResourceNotFound } from '../../../core/errors/resource-not-found'

export type RestartInstanceRequest = {
  instanceName: string
}

export type RestartInstanceResponse = Either<
  ResourceNotFound,
  {
    success: boolean
    qrcode?: string
  }
>

@Injectable()
export class RestartInstanceUseCase {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(private readonly envService: EnvService) {
    this.apiKey = this.envService.getApiKey()
    this.baseUrl = this.envService.getBaseUrl()
  }

  async execute({
    instanceName,
  }: RestartInstanceRequest): Promise<RestartInstanceResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/instance/restart/${instanceName}`,
        {
          method: 'POST',
          headers: { apikey: this.apiKey },
        },
      )

      if (!response.ok) {
        throw new Error('Failed to restart instance')
      }

      const data = await response.json()
      return right({ success: true, qrcode: data.qrcode })
    } catch (error) {
      return left(new ResourceNotFound('Failed to restart instance'))
    }
  }
}
