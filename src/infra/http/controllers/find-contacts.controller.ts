import { ResourceNotFound } from '@/core/errors/resource-not-found'
import { FindContactsUseCase } from '@/domain/application/use-cases/find-contacts'
import {
  Controller,
  Post,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'

@Controller('/find-contacts/:instanceName')
export class FindContactController {
  constructor(private findContacts: FindContactsUseCase) {}

  @Post()
  async handler(@Param('instanceName') instanceName: string) {
    const response = await this.findContacts.execute({ instanceName })

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case ResourceNotFound:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
    const findContacts = response.value

    return {
      findContacts,
    }
  }
}
