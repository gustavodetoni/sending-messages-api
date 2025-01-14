import { Module } from '@nestjs/common'
import { HttpModule as HttpModuleAxios } from '@nestjs/axios'
import { CreateInstanceService } from './create-instance'
import { SendTextService } from './send-text'
import { LogoutInstanceService } from './logout-instance'
import { InstanceConnectService } from './instance-connect'
import { ConnectionStateService } from './fetch-state'
import { EnvService } from '../env/env.service'
import { FindContactsService } from './find-contacts'

@Module({
  imports: [HttpModuleAxios],
  providers: [
    CreateInstanceService,
    SendTextService,
    LogoutInstanceService,
    InstanceConnectService,
    ConnectionStateService,
    FindContactsService,
    EnvService,
  ],
  exports: [
    CreateInstanceService,
    SendTextService,
    LogoutInstanceService,
    FindContactsService,
    InstanceConnectService,
    ConnectionStateService,
    EnvService,
],
})
export class EvolutionModule {}
