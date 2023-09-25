import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter, MulterModule } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

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

  const document = SwaggerModule.createDocument(app, swConfig);
  SwaggerModule.setup('api', app, document);

  MulterModule.register({
    dest: './uploads',
  });

  await app.listen(3001);
}
bootstrap();
