// import { NestFactory } from '@nestjs/core';
// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { AppModule } from './app.module';
// // import fastifyMulter from 'fastify-multer';
// import * as fastifyMulter from 'fastify-multer';
//
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, new FastifyAdapter());
//   const multer = fastifyMulter({
//     limits: {
//       fileSize: 4 * 1024 * 1024,
//     },
//   });
//   app.getHttpAdapter().getInstance().register(multer.contentParser);
//   const swConfig = new DocumentBuilder()
//     .setTitle('Events Maker')
//     .setDescription('The Events Maker system API description')
//     .setVersion('0.0.1')
//     .addTag('Auth/Register')
//     .addTag('Users')
//     .addTag('Events')
//     .addTag('Tasks')
//     .addTag('Microtasks')
//     .addTag('Images')
//     .addTag('Chats')
//     .addBearerAuth()
//     .build();
//   app.enableCors({
//     origin: true,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     credentials: true,
//   });
//
//   const options = {
//     explorer: true,
//   };
//   const document = SwaggerModule.createDocument(app, swConfig);
//   SwaggerModule.setup('api', app, document, options);
//
//   await app.listen(3001);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter, MulterModule } from '@nestjs/platform-express';
import * as express from 'express';

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

  // Configure Multer for file uploads
  MulterModule.register({
    dest: './uploads', // Set your desired upload directory
  });

  await app.listen(3001);
}

bootstrap();
