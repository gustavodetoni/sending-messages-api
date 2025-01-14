import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'

@Injectable()
export class FindContactsService {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(private readonly envService: EnvService) {
    this.apiKey = this.envService.getApiKey()
    this.baseUrl = this.envService.getBaseUrl()
  }

  async findContacts(instanceName: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/chat/findContacts/${instanceName}`,
      {
        method: 'POST',
        headers: {
          apikey: this.apiKey,
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to find contacts')
    }

    const data = await response.json()

    const result = data
      .map((contact) => ({
        pushName: contact.pushName,
        remoteJid: contact.remoteJid.split('@')[0],
      }))
      .filter((contact) => contact.remoteJid.length <= 13)

    return result
  }
}
