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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Socket;
  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    const roomName = client.handshake.query.room;
    if (!roomName) {
    } else {
      console.log(`Joined room: ${roomName}`);
      client.join(roomName);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
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
      const roomName = client.handshake.query.room;
      const user = await this.chatService.getUserFromSocket(client);
      body.username = user.username;
      const message = await this.chatService.saveMessage(body);
      this.server.to(roomName).emit('chatMessage', message);
    } catch (error) {
      console.error('Error in message handler:', error);
    }
  }
}
