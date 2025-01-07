import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/resource-not-found'
import { LogoutInstanceService } from '@/infra/evolution/logout-instance'

export type LogoutInstanceRequest = {
  instanceName: string
}

export type LogoutInstanceResponse = Either<
  ResourceNotFound,
  {
    success: string
  }
>

@Injectable()
export class LogoutInstanceUseCase {
  constructor(private readonly logoutInstanceService: LogoutInstanceService) {}

  async execute({
    instanceName,
  }: LogoutInstanceRequest): Promise<LogoutInstanceResponse> {
    try {
      const data = await this.logoutInstanceService.logoutInstance(instanceName)
      return right({
        success: data,
      })
    } catch (error) {
      return left(new ResourceNotFound('Instance'))
    }
  }
}
