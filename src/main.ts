import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter, MulterModule } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { WsAdapter } from '@nestjs/platform-ws';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  const configService = app.get(ConfigService);
  const APP_PORT = configService.get('PORT');
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
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useWebSocketAdapter(new WsAdapter(app));

  const httpServer = app.getHttpServer();
  const io = new IoAdapter(httpServer);

  app.useWebSocketAdapter(io);
  await app.listen(APP_PORT);
}
bootstrap().then();
