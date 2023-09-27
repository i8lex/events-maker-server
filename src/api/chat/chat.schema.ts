import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Message, MessageSchema } from './message.shema';

@Schema()
export class Chat extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  @ApiProperty({ example: 'user-id', description: 'User ID' })
  user: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  @ApiProperty({
    example: ['user-id-1', 'user-id-2'],
    description: 'Array of User IDs',
  })
  users: Types.ObjectId[];

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
    type: [MessageSchema],
    default: [],
  })
  @ApiProperty({
    example: [
      {
        user: 'user-id',
        username: 'Root445',
        messageType: 'text',
        text: 'Chat message',
        image: {
          name: 'avatar-1',
          buffer: 'image-buffer',
          thumbBuffer: 'thumb-buffer',
          mimeType: 'image/jpeg',
        },
        audio: {
          name: 'audio-1',
          buffer: 'audio-buffer',
          mimeType: 'audio/mpeg',
        },
        video: { name: 'video-1', link: 'video-link' },
        created: '2023-09-23T12:00:00Z',
      },
    ],
    description: 'Array of chat messages',
  })
  messages: Message[];

  @Prop()
  @ApiProperty({
    example: '2023-09-23T12:00:00Z',
    description: 'Date of Creation',
  })
  created: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
