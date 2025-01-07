import {
  Controller,
  Post,
  Param,
  NotFoundException,
  BadRequestException,
  Body,
  UsePipes,
} from '@nestjs/common'
import { RestartInstanceUseCase } from '../../../domain/application/use-cases/restart-instance'
import { ResourceNotFound } from '@/core/errors/resource-not-found'

@Controller('/restart/:instanceName')
export class RestartController {
  constructor(private restartInstance: RestartInstanceUseCase) {}

  @Post()
  async handler(
    @Param('instanceName') instanceName: string,
  ) {
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

    return response.value
  }
}
