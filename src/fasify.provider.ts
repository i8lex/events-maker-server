import { FastifyAdapter } from '@nestjs/platform-fastify';
import fastify from 'fastify';
import multipart from '@fastify/multipart';

export const fastifyFactory = {
  provide: 'FASTIFY_INSTANCE',
  useFactory: () => {
    const instance = fastify({ logger: true });
    instance.register(multipart);

    return instance;
  },
};
