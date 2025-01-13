import { Module } from '@nestjs/common'
import { CreateAndConnectInstanceUseCase } from '@/domain/application/use-cases/create-connect'
import { SendMessagesUseCase } from '../../domain/application/use-cases/send-messages'
import { EnvModule } from '../env/env.module'
import { HttpModule as HttpModuleAxios } from '@nestjs/axios'
import { CreateAndConnectController } from './controllers/create-connect.controller'
import { ConnectionStatusController } from './controllers/connection-status.controller'
import { EnvService } from '../env/env.service'
import { CheckConnectionStatusUseCase } from '@/domain/application/use-cases/check-connection'
import { LogoutController } from './controllers/logout.controller'
import { LogoutInstanceUseCase } from '@/domain/application/use-cases/logout-instance'
import { RestartController } from './controllers/reconnect.controller'
import { RestartInstanceUseCase } from '@/domain/application/use-cases/reconnect-instance'
import { SendMessagesController } from './controllers/send-messages.controller'
import { EvolutionModule } from '../evolution/evolution.module'

@Module({
  imports: [HttpModuleAxios, EvolutionModule, EnvModule],
  controllers: [
    CreateAndConnectController,
    ConnectionStatusController,
    LogoutController,
    RestartController,
    SendMessagesController,
  ],
  providers: [
    EnvService,
    CreateAndConnectInstanceUseCase,
    SendMessagesUseCase,
    SendMessagesUseCase,
    RestartInstanceUseCase,
    LogoutInstanceUseCase,
    CheckConnectionStatusUseCase,
  ],
})
export class HttpModule {}
