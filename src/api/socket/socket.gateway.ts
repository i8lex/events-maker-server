import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from '../chat/chat.service';
import { MessageDto } from '../chat/dto/message.dto';
import { UserService } from '../user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Socket;
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  private userSocketMap = new Map<string, string>();

  async handleConnection(client: Socket) {
    try {
      if (client.handshake.headers['authorization']) {
        const user = await this.chatService.getUserFromSocket(client);
        this.userSocketMap.set(user.userId, client.id);

        await this.userService.setStatus(user.userId, true);
        this.server.emit('userState', {
          userId: user.userId,
          isOnline: true,
        });
        console.log('User is online', client.id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async handleDisconnect(client: Socket) {
    if (client.handshake.headers['authorization']) {
      const user = await this.chatService.getUserFromSocket(client);
      await this.userService.setStatus(user.userId, false);
      this.server.emit('userState', {
        userId: user.userId,
        isOnline: false,
      });
      console.log('User is offline', client.id);
    }
  }

  // @SubscribeMessage('join-room')
  // async handleJoinRoom(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() body: string,
  // ) {
  //   try {
  //     client.join(body);
  //     console.log(client.rooms, 'rooms after');
  //   } catch (error) {
  //     console.error('Error in userState handler:', error);
  //   }
  // }
  //
  // @SubscribeMessage('leave-room')
  // async handleLeaveRoom(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() body: string,
  // ) {
  //   try {
  //     client.leave(body);
  //     console.log(`Leaved room: ${body}`, client.rooms);
  //   } catch (error) {
  //     console.error('Error in userState handler:', error);
  //   }
  // }

  @SubscribeMessage('chatMessage')
  async handleMessage(
    @MessageBody() body: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = await this.chatService.getUserFromSocket(client);
      body.username = user.username;

      if (!body.event) {
        const message = await this.chatService.saveMessage(body);

        body.users.forEach((userId) => {
          const socketId = this.userSocketMap.get(userId);
          this.server.to(socketId).emit('chatMessage', message);
          if (userId !== user.userId) {
            this.server.to(socketId).emit('counter', {
              _id: message._id,
              chatId: message.chatId,
              users: body.users,
            });
          }
        });
      }
      if (body.event === 'deliver') {
        const data = await this.chatService.deliverMessage(body, user.userId);
        body.users.forEach((userId) => {
          if (userId !== user.userId) {
            const socketId = this.userSocketMap.get(userId);
            this.server.to(socketId).emit('chatMessage', data);
          }
        });
      }
      if (body.event === 'read') {
        const data = await this.chatService.readBy(body, user.userId);
        body.users.forEach((userId) => {
          if (userId !== user.userId) {
            const socketId = this.userSocketMap.get(userId);
            this.server.to(socketId).emit('chatMessage', data);
          }
        });
      }
    } catch (error) {
      console.error('Error in message handler:', error);
    }
  }
}
