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
import { RestartController } from './controllers/restart.controller'
import { RestartInstanceUseCase } from '@/domain/application/use-cases/restart-instance'
import { SendMessagesController } from './controllers/send-messages.controller'
import { UploadCsvController } from './controllers/upload-csv.controller'
import { ProcessCsvAndSendMessagesUseCase } from '@/domain/application/use-cases/process-send-message'

@Module({
  imports: [HttpModuleAxios, EnvModule],
  controllers: [
    CreateAndConnectController,
    ConnectionStatusController,
    LogoutController,
    RestartController,
    SendMessagesController,
    UploadCsvController,
  ],
  providers: [
    EnvService,
    CreateAndConnectInstanceUseCase,
    SendMessagesUseCase,
    SendMessagesUseCase,
    RestartInstanceUseCase,
    ProcessCsvAndSendMessagesUseCase,
    LogoutInstanceUseCase,
    CheckConnectionStatusUseCase,
  ],
})
export class HttpModule {}
