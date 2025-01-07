import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/resource-not-found'
import { ConnectionStateService } from '@/infra/evolution/fetch-state'

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
  constructor(
    private readonly connectionStateService: ConnectionStateService,
  ) {}

  async execute({
    instanceName,
  }: CheckConnectionStatusRequest): Promise<CheckConnectionStatusResponse> {
    try {
      const response =
        await this.connectionStateService.checkConnectionStatus(instanceName)
      return right({
        status: response.instance.state,
      })
    } catch (error) {
      return left(new ResourceNotFound('Connection status'))
    }
  }
}
