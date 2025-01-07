import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'

@Injectable()
export class ConnectionStateService {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(private readonly envService: EnvService) {
    this.apiKey = this.envService.getApiKey()
    this.baseUrl = this.envService.getBaseUrl()
  }

  async checkConnectionStatus(instanceName: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/instance/connectionState/${instanceName}`,
      {
        method: 'GET',
        headers: {
          apikey: this.apiKey,
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to check connection status')
    }

    return response.json()
  }
}
