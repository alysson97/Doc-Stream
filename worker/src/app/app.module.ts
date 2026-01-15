import { Module } from '@nestjs/common';
import { PdfConsumerModule } from '../pdf-consumer/pdf-consumer.module';

@Module({
  imports: [PdfConsumerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
