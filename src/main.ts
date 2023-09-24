import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  const swConfig = new DocumentBuilder()
    .setTitle('Events Maker')
    .setDescription('The Events Maker system API description')
    .setVersion('0.0.1')
    .addTag('Auth/Register')
    .addTag('Users')
    .addTag('Events')
    .addTag('Tasks')
    .addTag('Microtasks')
    .addTag('Images')
    .addTag('Chats')
    .addBearerAuth()
    .build();

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const options = {
    explorer: true,
  };
  const document = SwaggerModule.createDocument(app, swConfig);
  SwaggerModule.setup('api', app, document, options);

  await app.listen(3001);
}
bootstrap();
