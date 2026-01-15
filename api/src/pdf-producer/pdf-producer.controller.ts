import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfProducerService } from './pdf-producer.service';

@Controller('pdf')
export class PdfProducerController {
  constructor(private readonly PdfProducerService: PdfProducerService) {}

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

    const jobId = this.PdfProducerService.publishPdfProcessing(file);

    return {
      jobId,
      status: 'PENDING',
    };
  }
}
