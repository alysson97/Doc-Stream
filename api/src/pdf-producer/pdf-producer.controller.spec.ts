import { Test, TestingModule } from '@nestjs/testing';
import { PdfProducerController } from './pdf-producer.controller';
import { PdfProducerService } from './pdf-producer.service';
import { BadRequestException } from '@nestjs/common';

describe('PdfProducerController', () => {
  let controller: PdfProducerController;
  let service: PdfProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfProducerController],
      providers: [
        {
          provide: PdfProducerService,
          useValue: {
            publishPdfProcessing: jest.fn(),
          },
        },
        {
          provide: 'PDF_QUEUE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PdfProducerController>(PdfProducerController);
    service = module.get<PdfProducerService>(PdfProducerService);
  });

  describe('uploadPdf', () => {
    it('should throw BadRequestException when file is not provided', async () => {
      await expect(controller.uploadPdf(undefined as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when file is not a PDF', async () => {
      const file = {
        originalname: 'test.txt',
        mimetype: 'text/plain',
        size: 100,
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      await expect(controller.uploadPdf(file)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return jobId and status PENDING for valid PDF', () => {
      const file = {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('pdf content'),
      } as Express.Multer.File;

      const mockJobId = '123e4567-e89b-12d3-a456-426614174000';
      (service.publishPdfProcessing as jest.Mock).mockResolvedValue(mockJobId);

      const result = controller.uploadPdf(file);

      expect(result).toEqual({
        jobId: mockJobId,
        status: 'PENDING',
      });
      expect(service.publishPdfProcessing.bind(service)).toHaveBeenCalledWith(
        file,
      );
    });
  });
});
