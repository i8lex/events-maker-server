import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event } from './event.schema';
import { CreateEventDto } from './dto/createEvent.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  async findAllEvents(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }
  async findAllEventsByOwner(request: Request): Promise<Event[]> {
    const token = request.headers['authorization'];
    const userId = await this.userService.getUserIdFromToken(token);

    return this.eventModel.find({ user: userId }).exec();
  }

  async findEventById(id: string): Promise<Event | null> {
    return this.eventModel.findById(id).exec();
  }

  async createEvent(request: Request, event: CreateEventDto): Promise<Event> {
    const token = request.headers['authorization'];
    const userId = await this.userService.getUserIdFromToken(token);
    const { title, description } = event;
    const newEvent = new this.eventModel({
      user: userId,
      title: title,
      description: description,
    });
    await this.userModel.updateOne(
      { _id: userId },
      { $push: { images: newEvent._id } },
    );
    return newEvent.save();
  }

  async updateEvent(
    request: Request,
    id: string,
    updateEvent: Partial<Event>,
  ): Promise<{ message: string } | null> {
    const token = request.headers['authorization'];
    const userId = await this.userService.getUserIdFromToken(token);
    await this.eventModel
      .updateOne({ _id: new Types.ObjectId(id), user: userId }, updateEvent, {
        new: true,
      })
      .exec();
    return { message: 'Event updated' };
  }

  async deleteEvent(id: string): Promise<void> {
    await this.eventModel.findByIdAndDelete(id).exec();
  }
}
