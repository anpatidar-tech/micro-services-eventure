import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Event Microservices API Gateway')
    .setDescription(
      'API Gateway for Auth, User, Event, and Friend microservices',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token', 
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log('API Gateway running on http://localhost:3000');
  console.log('Swagger available at http://localhost:3000/api/docs');
}
bootstrap();
