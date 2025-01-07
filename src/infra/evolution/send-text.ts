import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';

@Injectable()
export class SendTextService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private readonly envService: EnvService) {
    this.apiKey = this.envService.getApiKey();
    this.baseUrl = this.envService.getBaseUrl();
  }

  async sendMessage(
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
    );

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }

  replaceNameInMessage(message: string, name: string): string {
    return message.replace(/%name%/g, name);
  }
}
