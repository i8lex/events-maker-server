import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Microtask extends Document {
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
  @ApiProperty({ example: 'Microtask Title', description: 'Microtask Title' })
  title: string;

  @Prop()
  @ApiProperty({
    example: 'Microtask Description',
    description: 'Microtask Description',
  })
  description: string;

  @Prop({ type: [Types.ObjectId], ref: 'Task' })
  @ApiProperty({
    example: ['task-id-1', 'task-id-2'],
    description: 'Array of Task IDs',
  })
  tasks: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Image' })
  @ApiProperty({ example: 'image-id', description: 'Image ID' })
  image: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Audio' })
  @ApiProperty({ example: 'audio-id', description: 'Audio ID' })
  audio: Types.ObjectId;

  @Prop({ type: Object })
  @ApiProperty({
    example: { name: 'video-1', link: 'video-link-1' },
    description: 'Video Object',
  })
  video: {
    name: string;
    link: string;
  };

  @Prop()
  @ApiProperty({ example: 'false', description: 'Is microtask done' })
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
    description: 'Microtask Deadline',
  })
  deadline: Date;
}

export const MicrotaskSchema = SchemaFactory.createForClass(Microtask);
