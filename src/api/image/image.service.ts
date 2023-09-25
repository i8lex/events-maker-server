import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Image } from './image.schema';
import { Thumb } from './thumb.schema';
import { Event } from '../event/event.schema';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<Image>,
    @InjectModel(Thumb.name) private thumbModel: Model<Thumb>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  async findAllThumbsByEvent(eventId: string): Promise<Thumb[]> {
    return await this.thumbModel.find({ event: eventId }).exec();
  }

  async findImageById(imageId: string): Promise<Image> {
    return this.imageModel.findById(imageId).exec();
  }

  async uploadImages(
    images,
    request: Request,
    eventId: string,
  ): Promise<{ message: string }> {
    try {
      const token = request.headers['authorization'];
      const userId = await this.userService.getUserIdFromToken(token);
      const event: Event | null = await this.eventModel.findOne({
        _id: new Types.ObjectId(eventId),
      });
      if (!event) {
        return new BadRequestException('Event not found');
      }
      const user = await this.userModel.findById(userId);
      if (!user) {
        return new BadRequestException('User not found');
      }
      const promises = images.map(async (image) => {
        const thumbBuffer: Buffer = await sharp(image.buffer)
          .resize(100, 100, { fit: 'cover' })
          .toBuffer();
        if (!thumbBuffer) {
          throw new Error('Sharp did not produce a valid thumbBuffer.');
        }
        const addImage = new this.imageModel({
          user: userId,
          event: eventId,
          filename: image.originalname,
          mimetype: image.mimetype,
          size: image.buffer.length,
          image: image.buffer,
        });

        const addThumb = new this.thumbModel({
          user: userId,
          event: eventId,
          image: addImage._id,
          filename: image.originalname,
          size: thumbBuffer.length,
          thumb: thumbBuffer,
          mimetype: addImage.mimetype,
        });

        await addImage.save();
        await addThumb.save();

        await this.imageModel.updateOne(
          { _id: addImage._id },
          { $set: { thumb: addThumb._id } },
        );

        await this.eventModel.updateOne(
          { _id: eventId },
          { $push: { images: addImage._id } },
        );

        await this.userModel.updateOne(
          { _id: userId },
          { $push: { images: addImage._id } },
        );
        return { message: 'Image successfully uploaded' };
      });

      await Promise.all(promises);

      return { message: 'Images successfully uploaded' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: 'Something went wrong' }, error);
    }
  }

  async deleteImage(
    request: Request,
    imageIds: string[],
  ): Promise<{
    deletedCount: number;
    message: string;
  }> {
    const token = request.headers['authorization'];
    const userId = await this.userService.getUserIdFromToken(token);
    try {
      const imageIdsAsObjectId = imageIds.map((id) => new Types.ObjectId(id));
      const deletedImages = await this.imageModel.deleteMany({
        _id: { $in: imageIds },
        user: userId,
      });
      await this.thumbModel.deleteMany({
        image: { $in: imageIdsAsObjectId },
        user: userId,
      });
      await this.eventModel.updateMany(
        { images: { $in: imageIds } },
        { $pull: { images: { $in: imageIds } } },
      );
      await this.userModel.updateMany(
        { images: imageIds },
        { $pull: { images: { $in: imageIds } } },
      );

      if (deletedImages.deletedCount === 0) {
        throw new BadRequestException('Images not found');
      }

      return {
        deletedCount: deletedImages.deletedCount,
        message: 'Images successfully deleted',
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}
