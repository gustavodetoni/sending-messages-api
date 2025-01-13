import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/resource-not-found'
import { FindContactsService } from '@/infra/evolution/find-contacts'
import { Injectable } from '@nestjs/common'

export type FindContactsRequest = {
  instanceName: string
}

export type FindContactsResponse = Either<
  ResourceNotFound,
  {
    sucess: string
  }
>

@Injectable()
export class FindContactUseCase {
  constructor(private readonly findContactService: FindContactsService) {}
  async execute({
    instanceName,
  }: FindContactsRequest): Promise<FindContactsResponse> {
    try {
      const data = await this.findContactService.findContacts(instanceName)
      return right({
        sucess: data,
      })
    } catch (error) {
      return left(new ResourceNotFound('Contact'))
    }
  }
}
