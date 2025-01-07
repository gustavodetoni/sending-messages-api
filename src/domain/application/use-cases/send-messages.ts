import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/resource-not-found'
import { SendTextService } from '@/infra/evolution/send-text'

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
  constructor(private readonly sendTextService: SendTextService) {}

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
          const personalizedMessage = this.sendTextService.replaceNameInMessage(
            messageTemplate,
            contact.name,
          )
          const result = await this.sendTextService.sendMessage(
            instanceName,
            contact.number,
            personalizedMessage,
            delay,
          )
          results.push(result)
        }
      }

      return right({
        results,
      })
    } catch (error) {
      return left(new ResourceNotFound('Messages'))
    }
  }
}
