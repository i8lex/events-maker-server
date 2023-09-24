import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, UserSchema } from './api/user/user.schema';
import { Event, EventSchema } from './api/event/event.schema';
import { Image, ImageSchema } from './api/image/image.schema';
import { Thumb, ThumbSchema } from './api/image/thumb.schema';
import { Chat, ChatSchema } from './api/chat/chat.schema';
import { Task, TaskSchema } from './api/task/task.schema';
import { Microtask, MicrotaskSchema } from './api/microtask/microtask.schema';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { fastifyFactory } from './fasify.provider';
import { EnentModule } from './api/event/enent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    EnentModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, fastifyFactory],
})
export class AppModule {}
