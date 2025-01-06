import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { env } from './env'

@Injectable()
export class EnvService {
  constructor(private config: ConfigService<typeof env, true>) {}

  get<T extends keyof typeof env>(key: T) {
    return this.config.get(key, { infer: true })
  }
}
