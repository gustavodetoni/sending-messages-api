import { Injectable } from '@nestjs/common'
import { EnvService } from '../../../infra/env/env.service'
import { Either, left, right } from '../../../core/either'
import { ResourceNotFound } from '../../../core/errors/resource-not-found'

export type LogoutInstanceRequest = {
  instanceName: string
}

export type LogoutInstanceResponse = Either<
  ResourceNotFound,
  {
    success: boolean
  }
>

@Injectable()
export class LogoutInstanceUseCase {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(private readonly envService: EnvService) {
    this.apiKey = this.envService.getApiKey()
    this.baseUrl = this.envService.getBaseUrl()
  }

  async execute({
    instanceName,
  }: LogoutInstanceRequest): Promise<LogoutInstanceResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/instance/logout/${instanceName}`,
        {
          method: 'DELETE',
          headers: {
            apikey: this.apiKey,
          },
        },
      )

      if (!response.ok) {
        throw new Error('Failed to logout instance')
      }

      const data = await response.json()
      return right({ success: true })
    } catch (error) {
      return left(new ResourceNotFound('Failed to logout instance'))
    }
  }
}
