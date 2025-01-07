import { Controller, Post, Body, Param, BadRequestException } from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SendMessagesUseCase } from '../../../domain/application/use-cases/send-messages';
import { z } from 'zod';

@Controller('send-messages')
export class SendMessagesController {
  constructor(private sendMessages: SendMessagesUseCase) {}

  @Post(':instanceName')
  async sendMessages(
    @Param('instanceName') instanceName: string,
    @Body(new ZodValidationPipe(sendMessagesBodySchema)) body: { contacts: any[]; messages: string[]; delay: number }
  ) {
    const { contacts, messages, delay } = body;
    const result = await this.sendMessages.execute({
      instanceName,
      contacts,
      messages,
      delay
    });

    if (!result) {
      throw new BadRequestException('Failed to send messages');
    }

    return { message: 'Messages sent successfully' };
  }
}

const sendMessagesBodySchema = z.object({
  contacts: z.array(z.object({
    name: z.string(),
    phone: z.string().min(10, 'Phone number must be valid'),
  })),
  messages: z.array(z.string()),
  delay: z.number().min(0, 'Delay must be a positive number'),
});
