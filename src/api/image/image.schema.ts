import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Event } from '../event/event.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Image extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  @ApiProperty({ example: 'user-id', description: 'User ID' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Chat' })
  chat: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Event.name, required: true })
  @ApiProperty({ example: 'event-id', description: 'Event ID' })
  event: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Thumb', unique: true })
  thumb: Types.ObjectId;

  @Prop()
  @ApiProperty({ example: 'example-filename', description: 'Filename' })
  filename: string;

  @Prop()
  @ApiProperty({ example: 'image/png', description: 'MIME Type' })
  mimetype: string;

  @Prop()
  @ApiProperty({ example: 1024, description: 'Size in bytes' })
  size: number;

  @Prop()
  @ApiProperty({ example: 'path-to-image', description: 'Image Path' })
  path: string;

  @Prop({ type: Object })
  @ApiProperty({ example: {}, description: 'Image Object' })
  image: object;

  @Prop()
  @ApiProperty({ example: 'image/jpeg', description: 'Thumbnail MIME Type' })
  thumbMimetype: string;

  @Prop()
  @ApiProperty({ example: 512, description: 'Thumbnail Size in bytes' })
  thumbSize: number;

  @Prop()
  @ApiProperty({ example: 'path-to-thumbnail', description: 'Thumbnail Path' })
  thumbPath: string;

  @Prop({ default: Date.now })
  @ApiProperty({
    example: '2023-09-23T12:00:00Z',
    description: 'Date of creation',
  })
  created_at: Date;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
