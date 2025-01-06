import { Module } from '@nestjs/common'
import { HttpModule } from './http/http.module'
import { EnvModule } from './env/env.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    EnvModule,
  ],
})
export class AppModule {}
