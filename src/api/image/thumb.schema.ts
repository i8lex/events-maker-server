import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Thumb extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty({ example: 'user-id', description: 'User ID' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Chat' })
  @ApiProperty({ example: 'chat-id', description: 'Chat ID' })
  chat: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  @ApiProperty({ example: 'event-id', description: 'Event ID' })
  event: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Image', required: true, unique: true })
  @ApiProperty({ example: 'image-id', description: 'Image ID' })
  image: Types.ObjectId;

  @Prop()
  @ApiProperty({ example: 'Thumb Filename', description: 'Thumb Filename' })
  filename: string;

  @Prop()
  @ApiProperty({ example: 'image/jpeg', description: 'MIME Type' })
  mimetype: string;

  @Prop({ type: Object })
  @ApiProperty({
    example: { thumbData: 'thumb-data' },
    description: 'Thumb Object',
  })
  thumb: object;

  @Prop()
  @ApiProperty({ example: 1024, description: 'Thumb Size' })
  thumbSize: number;

  @Prop()
  @ApiProperty({ example: 'thumb-path', description: 'Thumb Path' })
  thumbPath: string;

  @Prop({ default: Date.now })
  @ApiProperty({
    example: '2023-09-23T12:00:00Z',
    description: 'Date of Creation',
  })
  created_at: Date;
}

export const ThumbSchema = SchemaFactory.createForClass(Thumb);
