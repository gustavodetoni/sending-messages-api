import {
  Controller,
  Post,
  Param,
  NotFoundException,
  BadRequestException,
  Body,
} from '@nestjs/common'
import { RestartInstanceUseCase } from '../../../domain/application/use-cases/restart-instance'
import { z } from 'zod'
import { ResourceNotFound } from '@/core/errors/resource-not-found'

const restartSchema = z.object({
  instanceName: z.string(),
})

type RestartSchema = z.infer<typeof restartSchema>

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
    const instance = response.value

    return {
      instance,
    }
  }
}
