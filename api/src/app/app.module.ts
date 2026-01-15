import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfProducerModule } from '../pdf-producer/pdf-producer.module';

@Module({
  imports: [PdfProducerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
