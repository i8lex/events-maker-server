import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';
import { Chat, ChatSchema } from './chat.schema';
import { Event, EventSchema } from '../event/event.schema';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { Message, MessageSchema } from './message.shema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: User.name, schema: UserSchema },
      { name: Event.name, schema: EventSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    AuthModule,
    UserModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
