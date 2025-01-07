import { Injectable, Inject } from '@nestjs/common'
import { EnvService } from '../../../infra/env/env.service'
import { Either, left, right } from '../../../core/either'
import { ResourceNotFound } from '../../../core/errors/resource-not-found'

export type Contact = {
  number: string
  name: string
}

export type SendMessagesRequest = {
  instanceName: string
  contacts: Contact[]
  messages: string[]
  delay: number
}

export type SendMessagesResponse = Either<
  ResourceNotFound,
  {
    results: any[]
  }
>

@Injectable()
export class SendMessagesUseCase {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(private readonly envService: EnvService) {
    this.apiKey = this.envService.getApiKey()
    this.baseUrl = this.envService.getBaseUrl()
  }

  async execute({
    instanceName,
    contacts,
    messages,
    delay,
  }: SendMessagesRequest): Promise<SendMessagesResponse> {
    try {
      const results = []

      for (const contact of contacts) {
        for (const messageTemplate of messages) {
          const personalizedMessage = this.replaceNameInMessage(
            messageTemplate,
            contact.name,
          )
          const result = await this.sendMessage(
            instanceName,
            contact.number,
            personalizedMessage,
            delay,
          )
          results.push(result)
        }
      }

      return right({ results })
    } catch (error) {
      return left(new ResourceNotFound('Failed to send messages'))
    }
  }

  private async sendMessage(
    instanceName: string,
    number: string,
    text: string,
    delay: number,
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/message/sendText/${instanceName}`,
      {
        method: 'POST',
        headers: {
          apikey: this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number, text, delay }),
      },
    )

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    return response.json()
  }

  private replaceNameInMessage(message: string, name: string): string {
    return message.replace(/%name%/g, name)
  }
}
