import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/optinal'

export type InstanceProps = {
  name: string
  qrCode?: string
  connectionStatus?: string
  createAt: Date
  upadateAt?: Date
}

export class Instance extends Entity<InstanceProps> {
  get name() {
    return this.props.name
  }

  get qrCode() {
    return this.props.qrCode || undefined
  }

  get connectionStatus() {
    return this.props.connectionStatus || undefined
  }

  get createAt() {
    return this.props.createAt
  }

  get upadateAt() {
    return this.props.upadateAt || undefined
  }

  updateQRCode(qrCode: string) {
    this.props.qrCode = qrCode
  }

  updateConnectionStatus(status: string) {
    this.props.connectionStatus = status
  }

  public static create(
    props: Optional<InstanceProps, 'createAt'>,
    id?: UniqueEntityID,
  ) {
    const instance = new Instance(
      {
        ...props,
        createAt: props.createAt ?? new Date(),
      },
      id,
    )
    return instance
  }
}
