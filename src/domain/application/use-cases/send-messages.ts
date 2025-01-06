import { Injectable } from '@nestjs/common'
import { Instance } from '../../enterprise/entities/instance'
import { EnvService } from 'src/infra/env/env.service'

export type Contact = {
  number: string
  name: string
}

export type SendMessagesRequest = {
  instance: Instance
  contacts: Contact[]
  messages: string[]
}

@Injectable()
export class SendMessagesUseCase {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(private readonly envService: EnvService) {
    this.apiKey = this.envService.getApiKey()
    this.baseUrl = this.envService.getBaseUrl()
  }

  async execute({
    instance,
    contacts,
    messages,
  }: SendMessagesRequest): Promise<any[]> {
    const results = []

    for (const contact of contacts) {
      for (const messageTemplate of messages) {
        const personalizedMessage = this.replaceNameInMessage(
          messageTemplate,
          contact.name,
        )
        const result = await this.sendMessage(
          instance.name,
          contact.number,
          personalizedMessage,
        )
        results.push(result)
      }
    }

    return results
  }

  private async sendMessage(
    instanceName: string,
    number: string,
    text: string,
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/message/sendText/${instanceName}`,
      {
        method: 'POST',
        headers: {
          apikey: this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number,
          text,
          delay: 10,
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`)
    }

    return response.json()
  }

  private replaceNameInMessage(message: string, name: string): string {
    return message.replace(/@name/g, name)
  }
}
