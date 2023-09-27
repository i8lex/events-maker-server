import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ChatModule } from '../chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';

import { Event, EventSchema } from '../event/event.schema';
import { User, UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ChatModule,
  ],
  providers: [SocketGateway],
})
export class SocketModule {}
