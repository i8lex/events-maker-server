import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.schema';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/api/auth/guards/jwt-auth.guard';
import { ChatDto } from './dto/chat.dto';

@Controller('chats')
@ApiTags('chats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ApiOperation({ summary: 'Get all chats' })
  @ApiResponse({ status: 200, description: 'OK', type: Chat, isArray: true })
  async getChatsByUserId(@Request() request): Promise<Partial<ChatDto>[]> {
    const chats = await this.chatService.getChatsByUserId(request);
    return chats;
  }
  @Get('chat/:id')
  @ApiOperation({ summary: 'Get a chat by ID' })
  @ApiResponse({ status: 200, description: 'OK', type: Chat })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async getChatById(
    @Param('id') id: string,
    @Request() request,
  ): Promise<Chat> {
    return this.chatService.getChatById(request, id);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Chat a user by ID' })
  @ApiResponse({ status: 200, description: 'OK', type: Chat })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string): Promise<Chat> {
    if (id) {
      return this.chatService.findById(id);
    } else {
      console.log('error');
    }
  }

  @Post('chat/create')
  @ApiOperation({ summary: 'Create a new chat for two' })
  @ApiResponse({ status: 201, description: 'Created', type: Chat })
  async createChatForTwo(
    @Request() request,
    @Body() body: { users: string[] },
  ): Promise<Chat> {
    return this.chatService.createChatForTwo(request, body.users);
  }
  @Get()
  async getAllChats(@Request() req) {
    const userId = req.user.id;
    return await this.chatService.getChatsByUserId(userId);
  }
  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a user by ID' })
  // @ApiResponse({ status: 204, description: 'No Content' })
  // @ApiResponse({ status: 404, description: 'User not found' })
  // async delete(@Param('id') id: number): Promise<void> {
  //   return this.chatService.delete(id);
  // }
}
