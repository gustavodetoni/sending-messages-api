import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'

@Injectable()
export class InstanceConnectService {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(private readonly envService: EnvService) {
    this.apiKey = this.envService.getApiKey()
    this.baseUrl = this.envService.getBaseUrl()
  }

  async restartInstance(instanceName: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/instance/connect/${instanceName}`,
      {
        method: 'GET',
        headers: {
          apikey: this.apiKey,
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to restart instance')
    }

    return response.json()
  }
}
