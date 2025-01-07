import { Injectable } from '@nestjs/common'
import { EnvService } from '../../../infra/env/env.service'
import { Either, left, right } from '../../../core/either'
import { ResourceNotFound } from '../../../core/errors/resource-not-found'
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
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(private readonly envService: EnvService) {
    this.apiKey = this.envService.getApiKey()
    this.baseUrl = this.envService.getBaseUrl()
  }

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
      return left(
        new ResourceNotFound('Failed to process CSV and send messages'),
      )
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
