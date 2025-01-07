import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/resource-not-found'
import { InstanceConnectService } from '@/infra/evolution/instance-connect'

export type RestartInstanceRequest = {
  instanceName: string
}

export type RestartInstanceResponse = Either<
  ResourceNotFound,
  {
    success: string
  }
>

@Injectable()
export class RestartInstanceUseCase {
  constructor(
    private readonly instanceConnectService: InstanceConnectService,
  ) {}

  async execute({
    instanceName,
  }: RestartInstanceRequest): Promise<RestartInstanceResponse> {
    try {
      const data =
        await this.instanceConnectService.restartInstance(instanceName)
      return right({
        success: data,
      })
    } catch (error) {
      return left(new ResourceNotFound('Instance'))
    }
  }
}
