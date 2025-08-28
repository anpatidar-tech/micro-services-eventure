import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { EventsModule } from './events-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(EventsModule, {
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });

  await app.listen();
  console.log('Event microservice is running');
}
bootstrap();
