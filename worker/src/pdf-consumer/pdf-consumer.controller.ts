import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import type { PdfProcessEvent } from '../../../packages/contracts/pdf-job.dto';

@Controller()
export class PdfConsumerController {
  private readonly logger = new Logger(PdfConsumerController.name);

  @EventPattern('pdf.processed')
  async handlePdf(
    @Payload() data: PdfProcessEvent,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`Processando job ${data.jobId}`);
      const buffer = Buffer.from(data.buffer, 'base64');
      await this.processPdf(buffer, data);
      this.logger.log(
        `PDF processado com sucesso. Job ID: ${data.jobId}, Tamanho do arquivo: ${buffer.length} bytes`,
      );
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`Erro no job ${data.jobId}`, error.stack);

      channel.nack(originalMsg, false, false);
    }
  }

  private async processPdf(
    buffer: Buffer,
    meta: Pick<PdfProcessEvent, 'jobId' | 'filename'>,
  ): Promise<void> {
    const sizeInKb = buffer.length / 1024;

    this.logger.log(`PDF ${meta.filename} (${sizeInKb.toFixed(2)} KB)`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
