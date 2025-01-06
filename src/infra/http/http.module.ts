import { Module } from '@nestjs/common'
import { InstanceController } from './controllers/instance.controller'
import { CreateAndConnectInstanceUseCase } from '@/domain/application/use-cases/create-connect'
import { SendMessagesUseCase } from '../../domain/application/use-cases/send-messages'
import { EnvModule } from '../env/env.module'
import { HttpModule as HttpModuleAxios } from '@nestjs/axios'

@Module({
  imports: [HttpModuleAxios, EnvModule],
  controllers: [InstanceController],
  providers: [CreateAndConnectInstanceUseCase, SendMessagesUseCase],
})
export class HttpModule {}
