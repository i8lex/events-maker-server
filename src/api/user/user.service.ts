import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserResponseService } from './user-response.service';
import { UserDTO } from './dto/user.dto';
import { ImageDto } from '../image/dto/image.dto';

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

  async findConnectedUsers(request: Request): Promise<UserDTO[]> {
    const token = request.headers['authorization'];
    const userId = await this.getUserIdFromToken(token);
    const currentUser = await this.userModel.findById(userId).exec();
    const users = await this.userModel
      .find({
        _id: { $ne: userId },
        isConfirmed: true,
        $or: [{ _id: { $in: currentUser.connects } }, { connects: userId }],
      })
      .exec();
    return this.userResponseService.getUsersForResponse(users, currentUser);
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
  async findOwner(request: Request): Promise<User | null> {
    const token = request.headers['authorization'];
    const userId = await this.getUserIdFromToken(token);
    return this.userModel.findById(userId).exec();
  }
  async findUserByName(name: string): Promise<User | null> {
    return this.userModel.findOne({ name }).exec();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
  async setStatus(userId: string, isOnline: boolean): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(userId, { isOnline }).exec();
  }

  async updateOwnerInfo(
    request: Request,
    updateUser: UserDTO,
    image: ImageDto,
  ): Promise<{ message: string } | null> {
    const token = request.headers['authorization'];
    const userId = await this.getUserIdFromToken(token);
    try {
      const updates = request.body as UserDTO;
      if (image[0]) {
        const avatar = {
          buffer: image[0].buffer,
          filename: image[0].originalname,
          mimetype: image[0].mimetype,
        };
        const updatedUser = await this.userModel.updateOne(
          { _id: userId },
          { $set: updates, avatar },
        );

        if (updatedUser.modifiedCount === 0) {
          throw new BadRequestException('Event not found');
        }
      } else {
        const updatedUser = await this.userModel.updateOne(
          { _id: userId },
          { $set: updates },
        );

        if (updatedUser.modifiedCount === 0) {
          throw new BadRequestException('Event not found');
        }
      }

      return { message: 'User updated' };
    } catch (err) {
      throw new Error('Something went wrong');
    }
  }

  async unTouchUser(
    request: Request,
    id: string,
  ): Promise<{ message: string }> {
    const token = request.headers['authorization'];
    const userId = await this.getUserIdFromToken(token);
    try {
      await this.userModel
        .findOneAndUpdate(userId, { $pull: { connects: id } })
        .exec();
      await this.userModel
        .findOneAndUpdate(new Types.ObjectId(id), {
          $pull: { connects: userId },
        })
        .exec();
      return { message: 'Successfully removed' };
    } catch (error) {
      throw new Error('Something went wrong');
    }
  }

  async addConnect(request: Request, id: string): Promise<string> {
    const token = request.headers['authorization'];
    const userId = await this.getUserIdFromToken(token);
    await this.userModel
      .findByIdAndUpdate(id, { $push: { connects: userId } })
      .exec();
    return 'Successfully added';
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
