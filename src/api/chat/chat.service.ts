import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Chat } from './chat.schema';
import { User } from '../user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MessageDto } from './dto/message.dto';
import { UserService } from '../user/user.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth/auth.service';
import { Message } from './message.shema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(AuthService) private readonly authService: AuthService,
  ) {}

  async createChatForTwo(request: Request, users: string[]): Promise<Chat> {
    const token = request.headers['authorization'];
    const ownerId = await this.userService.getUserIdFromToken(token);
    users.push(ownerId.toString());
    const usersObjectId = users.sort().map((user) => new Types.ObjectId(user));
    const chat = await this.chatModel.findOne({ users: usersObjectId }).exec();
    if (chat) {
      return chat;
    } else {
      const newChat = new this.chatModel({
        user: ownerId,
        users: users,
      });
      await this.userModel.updateMany(
        { _id: { $in: users } },
        { $push: { chats: newChat._id } },
      );
      await newChat.save();
      return newChat;
    }
  }
  async getAllChatsByUserId(request: Request): Promise<Chat[]> {
    const token = request.headers['authorization'];
    const userId = await this.userService.getUserIdFromToken(token);
    return this.chatModel.find({ users: new Types.ObjectId(userId) });
  }

  async getChatsByUserId(userId: string): Promise<Chat[]> {
    return this.chatModel.find({ user: userId });
  }

  async getChatById(request: Request, chatId: string): Promise<Chat> {
    const token = request.headers['authorization'];
    const userId = await this.userService.getUserIdFromToken(token);
    const chat = await this.chatModel.findById(chatId);
    chat.messages.map((message) => {
      if (!message.readBy.includes(userId.toString())) {
        message.readBy.push(userId.toString());
      }
    });
    await chat.save();
    return chat;
  }

  async findById(id: string): Promise<Chat> {
    if (!id) {
      console.log('error');
      return;
      // throw new NotFoundException('Chat not found');
    } else {
      return this.chatModel.findOne({ user: id });
    }
  }
  async saveMessage(body: MessageDto): Promise<Message> {
    const chat = await this.chatModel.updateOne(
      { _id: body.chatId },
      {
        $push: {
          messages: {
            message: body.message,
            messageType: 'text',
            user: body.userId,
            username: body.username,
            created: new Date(),
          },
        },
      },
    );
    if (chat.modifiedCount === 1) {
      const chat = await this.chatModel.findOne({ _id: body.chatId });
      return chat.messages[chat.messages.length - 1];
    } else {
      throw new WsException('Failed to save message');
    }
  }
  async readMessage(
    body: MessageDto,
    userId: string,
  ): Promise<{ userId: string; messageId: string }> {
    const chat = await this.chatModel.findById(body.chatId);
    if (!chat) {
      throw new WsException('Chat not found');
    }
    const message = chat.messages.find((msg) => {
      return msg._id.toString() === body.messageId;
    });
    if (!message) {
      throw new WsException('Message not found');
    }
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
    }
    await chat.save();

    return { userId, messageId: body.messageId };
  }
  async getUserFromSocket(socket: Socket) {
    let token = socket.handshake.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('Not authorized');
    }
    token = token.split(' ')[1];
    const user = await this.authService.getUserFromAuthenticationToken(token);
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }
}
