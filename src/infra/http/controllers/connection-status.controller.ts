import {
  Controller,
  Get,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { CheckConnectionStatusUseCase } from '@/domain/application/use-cases/check-connection'
import { ResourceNotFound } from '@/core/errors/resource-not-found'

@Controller('/connection-status/:instanceName')
export class ConnectionStatusController {
  constructor(private checkConnectionStatus: CheckConnectionStatusUseCase) {}

  @Get()
  async getConnectionStatus(@Param('instanceName') instanceName: string) {
    const response = await this.checkConnectionStatus.execute({
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
    const connectionStatus  = response.value

    return {
      connectionStatus,
    }
  }
}
