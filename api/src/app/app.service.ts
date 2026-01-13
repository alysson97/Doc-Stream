import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const helloMessage = 'Hello World!';
    return `${helloMessage} Com isso, o teste irá falhar !`;
  }
}
