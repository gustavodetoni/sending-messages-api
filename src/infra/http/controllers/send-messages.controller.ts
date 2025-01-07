import {
  Controller,
  Post,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { SendMessagesUseCase } from '@/domain/application/use-cases/send-messages'
import { number, z } from 'zod'
import { ResourceNotFound } from '@/core/errors/resource-not-found'

const sendMessagesBodySchema = z.object({
  contacts: z.array(
    z.object({
      name: z.string(),
      number: z.string(),
    }),
  ),
  messages: z.array(z.string()),
  delay: z.number(),
})

@Controller('/send-messages/:instanceName')
export class SendMessagesController {
  constructor(private sendMessage: SendMessagesUseCase) {}

  @Post()
  async sendMessages(
    @Param('instanceName') instanceName: string,
    @Body(new ZodValidationPipe(sendMessagesBodySchema))
    body: { contacts: any[]; messages: string[]; delay: number },
  ) {
    const { contacts, messages, delay } = body
    const response = await this.sendMessage.execute({
      instanceName,
      contacts,
      messages,
      delay,
    })

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case ResourceNotFound:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { message: 'Messages sent successfully' }
  }
}
