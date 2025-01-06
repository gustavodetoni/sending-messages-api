import { Controller, Post, Body, Get, Delete, Param, Inject, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpService } from '@nestjs/axios';
import { CreateAndConnectInstanceUseCase } from '@/domain/application/use-cases/create-connect';
import { CheckConnectionStatusUseCase } from '@/domain/application/use-cases/check-connection'; 
import { LogoutInstanceUseCase } from '../../../domain/application/use-cases/logout-instance';
import { RestartInstanceUseCase } from '../../../domain/application/use-cases/restart-instance';
import { SendMessagesUseCase } from '../../../domain/application/use-cases/send-messages';
import { ProcessCsvAndSendMessagesUseCase } from '@/domain/application/use-cases/process-send-message';
import { InstancePresenter } from '../presenters/instance.presenter';

@Controller('instances')
export class InstanceController {
  constructor(
    private createAndConnectInstance: CreateAndConnectInstanceUseCase,
    private checkConnectionStatus: CheckConnectionStatusUseCase,
    private logoutInstance: LogoutInstanceUseCase,
    private restartInstance: RestartInstanceUseCase,
    private sendMessages: SendMessagesUseCase,
    private processCsvAndSendMessages: ProcessCsvAndSendMessagesUseCase,
    @Inject('HttpService') private httpService: HttpService
  ) {}

  @Post('create-and-connect')
  async createAndConnect(@Body('instanceName') instanceName: string) {
    const result = await this.createAndConnectInstance.execute({ instanceName });
    return {
      instance: InstancePresenter.toHTTP(result.instance),
      qrcode: result.qrcode,
    };
  }

  @Get('connection-status/:instanceName')
  async getConnectionStatus(@Param('instanceName') instanceName: string) {
    return this.checkConnectionStatus.execute({ instanceName });
  }

  @Delete('logout/:instanceName')
  async logout(@Param('instanceName') instanceName: string) {
    return this.logoutInstance.execute({ instanceName });
  }

  @Post('restart/:instanceName')
  async restart(@Param('instanceName') instanceName: string) {
    return this.restartInstance.execute({ instanceName });
  }

  @Post('send-messages/:instanceName')
  async sendMessage(
    @Param('instanceName') instanceName: string,
    @Body() body: { contacts: any[]; messages: string[]; delay: number }
  ) {
    return this.sendMessages.execute({ 
      instanceName, 
      contacts: body.contacts, 
      messages: body.messages,
      delay: body.delay
    });
  }

  @Post('upload-csv-and-send/:instanceName')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsvAndSend(
    @Param('instanceName') instanceName: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { messages: string[]; delay: number }
  ) {
    return this.processCsvAndSendMessages.execute({
      instanceName,
      csvBuffer: file.buffer,
      messages: body.messages,
      delay: body.delay
    });
  }
}

