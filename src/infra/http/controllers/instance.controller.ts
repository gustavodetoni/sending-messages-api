import { Controller, Post, Body, HttpServer } from '@nestjs/common'
import { CreateAndConnectInstanceUseCase } from '@/domain/application/use-cases/create-connect'
import { SendMessagesUseCase } from '../../../domain/application/use-cases/send-messages'
import { InstancePresenter } from '../presenters/instance.presenter'

@Controller('instances')
export class InstanceController {
  constructor(
    private createAndConnectInstance: CreateAndConnectInstanceUseCase,
    private sendMessage: SendMessagesUseCase,
    private httpService: HttpServer,
  ) {}

  @Post('create-and-connect')
  async createAndConnect(@Body('instanceName') instanceName: string) {
    const result = await this.createAndConnectInstance.execute({ instanceName })
    return {
      instance: InstancePresenter.toHTTP(result.instance),
      connectResponse: result.connectResponse,
      connectionState: result.connectionState,
    }
  }

  @Post('send-messages')
  async sendMessages(
    @Body() body: { instanceName: string; contacts: any[]; messages: string[] },
  ) {
    const { instance } = await this.createAndConnectInstance.execute({
      instanceName: body.instanceName,
    })
    return this.sendMessage.execute({
      instance,
      contacts: body.contacts,
      messages: body.messages,
    })
  }
}
