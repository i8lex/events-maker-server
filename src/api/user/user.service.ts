import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './user.schema';
import { RegisterUserDTO } from '../auth/dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UserResponseService } from './user-response.service';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly userResponseService: UserResponseService,
  ) {}

  async findAllUsers(request: Request): Promise<UserDTO[]> {
    const token = request.headers['authorization'];
    const userId = await this.getUserIdFromToken(token);
    const currentUser = await this.userModel.findById(userId).exec();
    const users = await this.userModel
      .find({
        _id: { $ne: userId },
        isConfirmed: true,
      })
      .exec();
    return this.userResponseService.getUsersForResponse(users, currentUser);
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
  async findUserByName(name: string): Promise<User | null> {
    return this.userModel.findOne({ name }).exec();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(user: RegisterUserDTO): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async updateUser(
    id: string,
    updateUser: Partial<User>,
  ): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(id, updateUser, { new: true })
      .exec();
  }

  async deleteUser(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
  async getUserIdFromToken(token: string): Promise<Types.ObjectId> {
    try {
      const payload = this.jwtService.verify(token.split(' ')[1]);
      return new Types.ObjectId(payload.id);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
