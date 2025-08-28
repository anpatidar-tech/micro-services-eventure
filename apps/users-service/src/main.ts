import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { UsersModule } from './users-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UsersModule, {
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });

  await app.listen();
  console.log('Users Microservice is running');
}
bootstrap();
