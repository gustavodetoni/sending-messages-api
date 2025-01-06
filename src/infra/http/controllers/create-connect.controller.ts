import {
  Controller,
  Post,
  Body,
  UsePipes,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { CreateAndConnectInstanceUseCase } from '@/domain/application/use-cases/create-connect'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { ResourceNotFound } from '@/core/errors/resource-not-found'

const createInstanceNameSchema = z.object({
  instanceName: z.string(),
})

type CreateInstanceNameSchema = z.infer<typeof createInstanceNameSchema>

@Controller('/create-and-connect')
export class CreateAndConnectController {
  constructor(
    private createAndConnectInstance: CreateAndConnectInstanceUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createInstanceNameSchema))
  async handler(@Body() body: CreateInstanceNameSchema) {
    const { instanceName } = body

    const response = await this.createAndConnectInstance.execute({
      instanceName,
    })

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case ResourceNotFound:
          throw new ConflictException(error.message)
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
