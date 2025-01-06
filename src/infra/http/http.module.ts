import { Module } from '@nestjs/common'
import { InstanceController } from './controllers/instance.controller'
import { CreateAndConnectInstanceUseCase } from '@/domain/application/use-cases/create-connect'
import { SendMessagesUseCase } from '../../domain/application/use-cases/send-messages'
import { EnvModule } from '../env/env.module'
import { HttpModule as HttpModuleAxios } from '@nestjs/axios'
import { CreateAndConnectController } from './controllers/create-connect.controller'
import { ConnectionStatusController } from './controllers/connection-status.controller'
import { EnvService } from '../env/env.service'
import { CheckConnectionStatusUseCase } from '@/domain/application/use-cases/check-connection'

@Module({
  imports: [HttpModuleAxios, EnvModule],
  controllers: [CreateAndConnectController, ConnectionStatusController],
  providers: [
    EnvService,
    CreateAndConnectInstanceUseCase,
    SendMessagesUseCase,
    CheckConnectionStatusUseCase,
  ],
})
export class HttpModule {}
