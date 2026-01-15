import { Test, TestingModule } from '@nestjs/testing';
import { PdfConsumerController } from './pdf-consumer.controller';

describe('PdfConsumerController', () => {
  let controller: PdfConsumerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfConsumerController],
    }).compile();

    controller = module.get<PdfConsumerController>(PdfConsumerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
