import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PdfProducerController } from './pdf-producer.controller';
import { PdfProducerService } from './pdf-producer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PDF_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672',
          ],
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
