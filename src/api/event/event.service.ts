import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './event.schema';
import { CreateEventDto } from './dto/createEvent.dto';
import { UserService } from '../user/user.service';
@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
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

  async createEvent(event: CreateEventDto): Promise<Event> {
    const newEvent = new this.eventModel(event);
    return newEvent.save();
  }

  async updateEvent(
    id: string,
    updateEvent: Partial<Event>,
  ): Promise<Event | null> {
    return await this.eventModel
      .findByIdAndUpdate(id, updateEvent, { new: true })
      .exec();
  }

  async deleteEvent(id: string): Promise<void> {
    await this.eventModel.findByIdAndDelete(id).exec();
  }
}
