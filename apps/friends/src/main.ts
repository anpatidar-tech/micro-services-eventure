import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { FriendsModule } from './friends.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(FriendsModule, {
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });

  await app.listen();
  console.log('Friends Microservice is running');
}
bootstrap();
