import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/resource-not-found'
import { SendTextService } from '@/infra/evolution/send-text'
import * as csv from 'csv-parse'

export type Contact = {
  name: string
  number: string
}

export type ProcessCsvAndSendMessagesRequest = {
  instanceName: string
  csvBuffer: Buffer
  messages: string[]
  delay: number
}

export type ProcessCsvAndSendMessagesResponse = Either<
  ResourceNotFound,
  {
    results: any[]
  }
>

@Injectable()
export class ProcessCsvAndSendMessagesUseCase {
  constructor(private readonly sendTextService: SendTextService) {}

  async execute({
    instanceName,
    csvBuffer,
    messages,
    delay,
  }: ProcessCsvAndSendMessagesRequest): Promise<ProcessCsvAndSendMessagesResponse> {
    try {
      const contacts = await this.parseCsv(csvBuffer)
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
      return left(new ResourceNotFound('Process CSV'))
    }
  }

  private async parseCsv(csvBuffer: Buffer): Promise<Contact[]> {
    return new Promise((resolve, reject) => {
      const contacts: Contact[] = []
      csv
        .parse(csvBuffer, {
          columns: true,
          skip_empty_lines: true,
        })
        .on('data', (row) => {
          contacts.push({
            name: row.name,
            number: row.phone,
          })
        })
        .on('end', () => resolve(contacts))
        .on('error', (error) => reject(error))
    })
  }
}
