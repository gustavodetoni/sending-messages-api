import { Injectable } from '@nestjs/common'
import { Instance } from '@/domain/enterprise/entities/instance'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/resource-not-found'
import { CreateInstanceService } from '@/infra/evolution/create-instance'
import { ResourceAlreadyExists } from '@/core/errors/resource-already-exists'

export type CreateAndConnectInstanceRequest = {
  instanceName: string
}

export type CreateAndConnectInstanceResponse = Either<
  ResourceNotFound,
  {
    instance: Instance
  }
>

@Injectable()
export class CreateAndConnectInstanceUseCase {
  constructor(private readonly createInstanceService: CreateInstanceService) {}

  async execute({
    instanceName,
  }: CreateAndConnectInstanceRequest): Promise<CreateAndConnectInstanceResponse> {
    const createResponse =
      await this.createInstanceService.createInstance(instanceName)

    if (createResponse instanceof Error) {
      return left(
        new ResourceAlreadyExists('Instance'),
      )
    }

    const instance = Instance.create(
      {
        name: instanceName,
        qrCode: createResponse.qrcode,
        connectionStatus: 'created',
      },
      new UniqueEntityID(createResponse.id),
    )

    return right({
      instance: instance,
    })
  }
}
