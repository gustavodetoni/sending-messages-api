import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'

@Injectable()
export class CreateInstanceService {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(private readonly envService: EnvService) {
    this.apiKey = this.envService.getApiKey()
    this.baseUrl = this.envService.getBaseUrl()
  }

  async createInstance(instanceName: string): Promise<any | Error> {
    try {
      const response = await fetch(`${this.baseUrl}/instance/create`, {
        method: 'POST',
        headers: {
          apikey: this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instanceName,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create instance')
      }

      return await response.json()
    } catch (error) {
      return error
    }
  }
}
