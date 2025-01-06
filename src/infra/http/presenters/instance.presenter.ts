import { Instance } from '@/domain/enterprise/entities/instance'

export class InstancePresenter {
  static toHTTP(instance: Instance) {
    return {
      id: instance.id.toString(),
      name: instance.name,
      qrCode: instance.qrCode,
      connectionStatus: instance.connectionStatus,
      createAt: instance.createAt,
      updateAt: instance.upadateAt,
    }
  }
}
