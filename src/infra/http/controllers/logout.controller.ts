import {
  Controller,
  Delete,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { LogoutInstanceUseCase } from '../../../domain/application/use-cases/logout-instance'
import { ResourceNotFound } from '@/core/errors/resource-not-found'

@Controller('/logout/:instanceName')
export class LogoutController {
  constructor(private logoutInstance: LogoutInstanceUseCase) {}

  @Delete()
  async logout(@Param('instanceName') instanceName: string) {
    const response = await this.logoutInstance.execute({
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
  }
}
