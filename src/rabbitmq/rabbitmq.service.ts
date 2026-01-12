/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('PDF_QUEUE')
    private readonly pdfQueueClient: ClientProxy,
  ) {}

  publishPdfProcessing(file: Express.Multer.File): string {
    const jobId = randomUUID();

    this.pdfQueueClient.emit('pdf.process', {
      jobId,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer.toString('base64'),
      createdAt: new Date().toISOString(),
    });

    return jobId;
  }

  getQueueClient(): ClientProxy {
    return this.pdfQueueClient;
  }
}
