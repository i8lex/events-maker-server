import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { RegisterUserDTO } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
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
}
