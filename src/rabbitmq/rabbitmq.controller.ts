/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RabbitMQService } from './rabbitmq.service';

@Controller('pdf')
export class RabbitMQController {
  constructor(private readonly rabbitmqService: RabbitMQService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadPdf(@UploadedFile() file: Express.Multer.File): {
    jobId: string;
    status: string;
  } {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Apenas arquivos PDF são permitidos');
    }

    const jobId = this.rabbitmqService.publishPdfProcessing(file);

    return {
      jobId,
      status: 'PENDING',
    };
  }
}
