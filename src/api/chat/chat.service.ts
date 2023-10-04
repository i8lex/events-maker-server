import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { ChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(AuthService) private readonly authService: AuthService,
  ) {}

  async createChatForTwo(request: Request, users: string[]): Promise<Chat> {
    const token = request.headers['authorization'];
    const ownerId = await this.userService.getUserIdFromToken(token);
    users.push(ownerId.toString());
    const usersObjectId = users.sort().map((user) => new Types.ObjectId(user));
    const chat = await this.chatModel.findOne({ users: usersObjectId }).exec();
    const usersFromBD = await this.userModel.find({
      _id: { $in: users },
    });

    const userNames = usersFromBD.map((user) => user.name);
    if (chat) {
      return chat;
    } else {
      const newChat = new this.chatModel({
        user: ownerId,
        users: users,
        userNames: userNames,
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

  async getChatsByUserId(request: Request): Promise<Partial<ChatDto>[]> {
    const token = request.headers['authorization'];
    const userId = await this.userService.getUserIdFromToken(token);
    const chats = await this.chatModel.find({
      users: {
        $elemMatch: {
          $eq: userId,
        },
      },
    });
    const chatsDto = await Promise.all(
      chats.map(async (chat) => {
        const unreadMessages = await this.messageModel.find({
          chat: chat._id,
          readBy: { $ne: userId },
        });

        console.log(unreadMessages);
        const chatDto: Partial<ChatDto> = {
          _id: chat._id,
          title: '',
          user: chat.user,
          users: chat.users,
          event: chat.event,
          task: chat.task,
          microtask: chat.microtask,
          created: chat.created,
          messages: unreadMessages,
          userNames: chat.userNames,
        };
        console.log(chatDto);
        return chatDto;
      }),
    );
    console.log(chatsDto);
    return chatsDto;
  }

  async getChatById(request: Request, chatId: string): Promise<Chat> {
    const token = request.headers['authorization'];
    const userId = await this.userService.getUserIdFromToken(token);
    await this.messageModel.updateMany(
      { chatId: chatId },
      { $addToSet: { readBy: userId } },
      { new: true },
    );

    return await this.chatModel.findById(chatId).populate('messages').exec();
  }

  async findById(id: string): Promise<Chat> {
    if (!id) {
      console.log('error');
      throw new NotFoundException('Chat not found');
    } else {
      return this.chatModel.findOne({ user: id });
    }
  }
  async saveMessage(body: MessageDto): Promise<Message> {
    const message = await new this.messageModel({
      chatId: body.chatId,
      message: body.message,
      messageType: 'text',
      user: body.userId,
      username: body.username,
      deliveredTo: [body.userId],
      readBy: [body.userId],
      created: new Date(),
    });
    await message.save();
    const chat = await this.chatModel.updateOne(
      { _id: body.chatId },
      { $push: { messages: message._id } },
    );
    if (chat.modifiedCount === 1) {
      return message;
    } else {
      throw new WsException('Failed to save message');
    }
  }
  async deliverMessage(
    body: MessageDto,
    userId: Types.ObjectId,
  ): Promise<{
    userId: Types.ObjectId;
    messageId: Types.ObjectId;
    type: string;
  }> {
    const message = await this.messageModel.findByIdAndUpdate(
      body.messageId,
      { $addToSet: { deliveredTo: userId } },
      { new: true },
    );
    if (!message) {
      throw new WsException('Message not found');
    }
    return { userId, messageId: body.messageId, type: 'deliver' };
  }

  async readBy(
    body: MessageDto,
    userId: Types.ObjectId,
  ): Promise<{ userId: Types.ObjectId; messageId: Types.ObjectId }> {
    const { messageId } = body;
    const message = await this.messageModel.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: userId } },
      { new: true },
    );
    if (!message) {
      throw new WsException('Message not found');
    }
    if (message) {
      return { userId, messageId: messageId };
    }
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
