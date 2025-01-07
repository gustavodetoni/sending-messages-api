import { Controller, Post, UploadedFile, Param, Body, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { ProcessCsvAndSendMessagesUseCase } from '../../../domain/application/use-cases/process-csv-and-send-messages';
import { z } from 'zod';

@Controller('upload-csv-and-send')
export class UploadCsvController {
  constructor(private processCsvAndSendMessages: ProcessCsvAndSendMessagesUseCase) {}

  @Post(':instanceName')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsvAndSend(
    @Param('instanceName') instanceName: string,
    @UploadedFile() file: Express.Multer.File,
    @Body(new ZodValidationPipe(csvUploadBodySchema)) body: { messages: string[]; delay: number }
  ) {
    const { messages, delay } = body;

    const result = await this.processCsvAndSendMessages.execute({
      instanceName,
      csvBuffer: file.buffer,
      messages,
      delay,
    });

    if (!result) {
      throw new BadRequestException('Failed to process CSV and send messages');
    }

    return { message: 'CSV processed and messages sent successfully' };
  }
}

const csvUploadBodySchema = z.object({
  messages: z.array(z.string()),
  delay: z.number().min(0, 'Delay must be a positive number'),
});
