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
    const chatsFromDB = await this.chatModel.find({
      users: {
        $elemMatch: {
          $eq: userId,
        },
      },
    });
    return await Promise.all(
      chatsFromDB.map(async (chat) => {
        const unreadMessages = await this.messageModel.find({
          chatId: chat._id.toString(),
          readBy: { $ne: userId },
        });
        // console.log(unreadMessages);
        const chats: Partial<ChatDto> = {
          _id: chat._id,
          title: '',
          user: chat.user,
          users: chat.users,
          event: chat.event,
          task: chat.task,
          microtask: chat.microtask,
          created: chat.created,
          messages: unreadMessages.map((message) => {
            return { _id: message._id };
          }),
          userNames: chat.userNames,
        };
        return chats;
      }),
    );
  }

  async getChatById(request: Request, chatId: string): Promise<Chat> {
    return await this.chatModel.findById(chatId).populate('messages').exec();
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
    event: string;
  }> {
    const message = await this.messageModel.findByIdAndUpdate(
      body.messageId,
      { $addToSet: { deliveredTo: userId } },
      { new: true },
    );
    if (!message) {
      throw new WsException('Message not found');
    }
    return { userId, messageId: body.messageId, event: 'deliver' };
  }

  async readBy(
    body: MessageDto,
    userId: Types.ObjectId,
  ): Promise<{
    userId: Types.ObjectId;
    messageId: Types.ObjectId;
    event: 'read';
  }> {
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
      return { userId, messageId: messageId, event: 'read' };
    }
  }
  async getUserFromSocket(socket: Socket) {
    try {
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
    } catch (err) {
      console.log('Error in getUserFromSocket', err);
    }
  }
}
