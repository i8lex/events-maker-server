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

  async handleConnection(client: Socket) {
    try {
      if (client.handshake.headers['authorization']) {
        const user = await this.chatService.getUserFromSocket(client);
        await this.userService.setStatus(user.userId, true);
        this.server.emit('userState', {
          userId: user.userId,
          isOnline: true,
        });
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
    }
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: string,
  ) {
    try {
      console.log(`Joined room: ${body}`);
      client.join(body);
    } catch (error) {
      console.error('Error in userState handler:', error);
    }
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: string,
  ) {
    try {
      console.log(`Leaved room: ${body}`);
      client.leave(body);
    } catch (error) {
      console.error('Error in userState handler:', error);
    }
  }

  @SubscribeMessage('userState')
  async handleUserState(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: boolean,
  ) {
    try {
      if (client.handshake.headers['authorization']) {
        const user = await this.chatService.getUserFromSocket(client);

        await this.userService.setStatus(user.userId, body);
        this.server.emit('userState', {
          userId: user.userId,
          isOnline: body,
        });
      }
    } catch (error) {
      console.error('Error in userState handler:', error);
    }
  }

  @SubscribeMessage('isDeliveredMessage')
  async handleDeliverMessage(
    @MessageBody() body: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.chatService.getUserFromSocket(client);
    const roomName = client.handshake.query.room;
    const deliverTo = await this.chatService.deliverMessage(body, user.userId);
    this.server.to(roomName).emit('isDeliveredMessage', deliverTo.userId);
  }

  @SubscribeMessage('readMessage')
  async handleReadMessage(
    @MessageBody() body: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.chatService.getUserFromSocket(client);
    const roomName = client.handshake.query.room;
    const readBy = await this.chatService.readBy(body, user.userId);
    this.server.to(roomName).emit('readMessage', readBy);
  }

  @SubscribeMessage('chatMessage')
  async handleMessage(
    @MessageBody() body: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = await this.chatService.getUserFromSocket(client);
      body.username = user.username;
      const message = await this.chatService.saveMessage(body);
      this.server.to(body.chatId).emit('chatMessage', message);
    } catch (error) {
      console.error('Error in message handler:', error);
    }
  }
}
