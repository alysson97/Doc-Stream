import { Module } from '@nestjs/common';
import { PdfConsumerController } from './pdf-consumer.controller';

@Module({
  imports: [],
  controllers: [PdfConsumerController],
  providers: [],
  exports: [],
})
export class PdfConsumerModule {}
