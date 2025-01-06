import { Either } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/resource-not-found'
import { Instance } from '@/domain/enterprise/entities/instance'

export abstract class InstanceRepository {
  abstract create(instance: Instance): Promise<Instance>
  abstract findByName(name: string): Promise<Either<ResourceNotFound, Instance>>
  abstract save(instance: Instance): Promise<void>
}
