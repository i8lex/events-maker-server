import {
  Controller,
  Get,
  Put,
  Delete,
  Request,
  Param,
  Body,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/api/auth/guards/jwt-auth.guard';
import { UserDTO } from './dto/user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'OK', type: User, isArray: true })
  async findAll(@Request() request): Promise<UserDTO[]> {
    return this.userService.findAllUsers(request);
  }
  @Get('user')
  @ApiOperation({ summary: 'Get an owner by ID' })
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getOwner(@Request() request): Promise<User> {
    return this.userService.findOwner(request);
  }
  @Get('connected')
  @ApiOperation({ summary: 'Get an owner by ID' })
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getConnected(@Request() request): Promise<UserDTO[]> {
    return this.userService.findConnectedUsers(request);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string): Promise<User> {
    return this.userService.findUserById(id);
  }

  @Post('add/:id')
  @ApiOperation({ summary: 'Add connect to user by ID' })
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async addConnect(
    @Request() request,
    @Param('id') id: string,
  ): Promise<string> {
    return this.userService.addConnect(request, id);
  }

  @Put()
  @ApiOperation({ summary: 'Update  user' })
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseInterceptors(FilesInterceptor('image'))
  async updateOwnerInfo(
    @UploadedFiles() image,
    @Request() request,
    @Body() updateUser: UserDTO,
  ): Promise<{ message: string }> {
    return this.userService.updateOwnerInfo(request, updateUser, image);
  }

  @Delete('untouch/:id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async unTouchConnect(
    @Request() request,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.userService.unTouchUser(request, id);
  }
}
