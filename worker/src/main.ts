import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const rabbitmqUrl = process.env.RABBITMQ_URL;

if (!rabbitmqUrl) {
  throw new Error('RABBITMQ_URL is not defined in environment variables');
}

const microserviceOptions: MicroserviceOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [rabbitmqUrl],
    queue: 'docstream_queue',
  },
};

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    microserviceOptions,
  );
  // await app.listen(process.env.PORT ?? 3000);
  await app.listen();
  console.log('Worker microservice is listening...');
}
void bootstrap();
