import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Task extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  @ApiProperty({ example: 'user-id', description: 'User ID' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Chat' })
  @ApiProperty({ example: 'chat-id', description: 'Chat ID' })
  chat: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Event' })
  @ApiProperty({
    example: ['event-id-1', 'event-id-2'],
    description: 'Array of Event IDs',
  })
  events: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  @ApiProperty({
    example: ['user-id-1', 'user-id-2'],
    description: 'Array of User IDs',
  })
  taggedUsers: Types.ObjectId[];

  @Prop()
  @ApiProperty({ example: 'Task Title', description: 'Task Title' })
  title: string;

  @Prop()
  @ApiProperty({ example: 'Task Description', description: 'Task Description' })
  description: string;

  @Prop({ type: [Types.ObjectId], ref: 'Microtask' })
  @ApiProperty({
    example: ['microtask-id-1', 'microtask-id-2'],
    description: 'Array of Microtask IDs',
  })
  microtasks: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Image' })
  @ApiProperty({
    example: ['image-id-1', 'image-id-2'],
    description: 'Array of Image IDs',
  })
  images: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Audio' })
  @ApiProperty({
    example: ['audio-id-1', 'audio-id-2'],
    description: 'Array of Audio IDs',
  })
  audios: Types.ObjectId[];

  @Prop()
  @ApiProperty({
    example: [{ name: 'video-1', link: 'video-link-1' }],
    description: 'Array of Video Objects',
  })
  videos: {
    name: string;
    link: string;
  }[];

  @Prop()
  @ApiProperty({ example: 'false', description: 'Is task done' })
  done: boolean;

  @Prop({ default: Date.now })
  @ApiProperty({
    example: '2023-09-23T12:00:00Z',
    description: 'Date of Creation',
  })
  created: Date;

  @Prop({ default: new Date(0) })
  @ApiProperty({
    example: '2023-09-30T12:00:00Z',
    description: 'Task Deadline',
  })
  deadline: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
