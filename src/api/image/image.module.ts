import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { Image, ImageSchema } from './image.schema';
import { Thumb, ThumbSchema } from './thumb.schema';
import { Event, EventSchema } from '../event/event.schema';

import { ImageService } from './image.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { EventModule } from '../event/event.module';
import { User, UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Image.name, schema: ImageSchema },
      { name: Thumb.name, schema: ThumbSchema },
      { name: Event.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
    EventModule,
    UserModule,
  ],
  providers: [ImageService],
  controllers: [ImageController],
  exports: [ImageService],
})
export class ImageModule {}
