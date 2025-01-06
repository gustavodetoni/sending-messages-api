import { Entity } from "src/core/entities/entity";

export type InstanceProps = {
    name: string;
    qrCode?: string;
    connectionStatus?: string;
}

export class Instance extends Entity<InstanceProps> {
    get name() {
        return this.props.name;
    }

    get qrCode() {
        return this.props.qrCode;
    }

    get connectionStatus() {
        return this.props.connectionStatus;
    }

    static create(props: InstanceProps) {
        return new Instance(props);
    }
}