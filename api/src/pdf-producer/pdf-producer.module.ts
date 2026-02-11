import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PdfProducerController } from './pdf-producer.controller';
import { PdfProducerService } from './pdf-producer.service';

const rabbitUrl = process.env.RABBITMQ_URL;

if (!rabbitUrl) {
  throw new Error('ERRO CRÍTICO: Variável de ambiente RABBITMQ_URL não definida.');
}

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PDF_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: [rabbitUrl],
          queue: 'pdf_processing_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [PdfProducerController],
  providers: [PdfProducerService],
  exports: [PdfProducerService],
})
export class PdfProducerModule {}
