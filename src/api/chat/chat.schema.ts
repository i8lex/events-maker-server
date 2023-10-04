import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Chat extends Document {
  @Prop({ type: String })
  @ApiProperty({ example: 'Tess room', description: 'The title of the chat' })
  title?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @ApiProperty({ example: 'user-id', description: 'User ID' })
  user: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  @ApiProperty({
    example: ['user-id-1', 'user-id-2'],
    description: 'Array of User IDs',
  })
  users: Types.ObjectId[];

  @Prop({ type: [String] })
  @ApiProperty({ example: ['Root12', 'Root13'], description: 'Names of users' })
  userNames: string[];

  @Prop({ type: Types.ObjectId, ref: 'Event' })
  @ApiProperty({ example: 'event-id', description: 'Event ID' })
  event: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Task' })
  @ApiProperty({ example: 'task-id', description: 'Task ID' })
  task: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Microtask' })
  @ApiProperty({ example: 'microtask-id', description: 'Microtask ID' })
  microtask: Types.ObjectId;

  @Prop({
    type: [Types.ObjectId],
    ref: 'Message',
    default: [],
  })
  @ApiProperty({
    example: ['message-id-1', 'message-id-2'],
    description: 'Array of chat messages',
  })
  messages: Types.ObjectId[];

  @Prop()
  @ApiProperty({
    example: '2023-09-23T12:00:00Z',
    description: 'Date of Creation',
  })
  created: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
