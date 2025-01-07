import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'

@Injectable()
export class LogoutInstanceService {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(private readonly envService: EnvService) {
    this.apiKey = this.envService.getApiKey()
    this.baseUrl = this.envService.getBaseUrl()
  }

  async logoutInstance(instanceName: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/instance/logout/${instanceName}`,
      {
        method: 'DELETE',
        headers: {
          apikey: this.apiKey,
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to logout instance')
    }

    return response.json()
  }
}
