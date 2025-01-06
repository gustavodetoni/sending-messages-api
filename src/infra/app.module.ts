import { Module } from '@nestjs/common'
import { HttpModule } from './http/http.module'
import { EnvModule } from './env/env.module'

@Module({
  imports: [HttpModule, EnvModule],
})
export class AppModule {}
