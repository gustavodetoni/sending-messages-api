import {
  Controller,
  Param,
  NotFoundException,
  BadRequestException,
  Get,
} from '@nestjs/common'
import { RestartInstanceUseCase } from '@/domain/application/use-cases/reconnect-instance'
import { ResourceNotFound } from '@/core/errors/resource-not-found'

@Controller('/reconnect/:instanceName')
export class RestartController {
  constructor(private restartInstance: RestartInstanceUseCase) {}

  @Get()
  async handler(@Param('instanceName') instanceName: string,) {
    const response = await this.restartInstance.execute({
      instanceName,
    })

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case ResourceNotFound:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
    const restartInstance = response.value

    return {
      restartInstance,
    }
  }
}
