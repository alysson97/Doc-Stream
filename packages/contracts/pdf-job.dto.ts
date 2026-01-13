export interface PdfProcessEvent {
  jobId: string;
  filename: string;
  buffer: string;
  mimetype: 'application/pdf';
  size: number;
  createdAt: string;
}
