import {
  Controller,
  Post,
  UploadedFile,
  Param,
  Body,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ProcessCsvAndSendMessagesUseCase } from '@/domain/application/use-cases/process-send-message'
import { z } from 'zod'
import { ResourceNotFound } from '@/core/errors/resource-not-found'

const csvUploadBodySchema = z.object({
  messages: z.array(z.string()),
  delay: z.number(),
})

@Controller('/upload-csv-and-send/:instanceName')
export class UploadCsvController {
  constructor(
    private processCsvAndSendMessages: ProcessCsvAndSendMessagesUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handler(
    @Param('instanceName') instanceName: string,
    @UploadedFile() file: Express.Multer.File,
    @Body(new ZodValidationPipe(csvUploadBodySchema))
    body: { messages: string[]; delay: number },
  ) {
    const { messages, delay } = body

    const response = await this.processCsvAndSendMessages.execute({
      instanceName,
      csvBuffer: file.buffer,
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

    return { message: 'CSV processed and messages sent successfully' }
  }
}
