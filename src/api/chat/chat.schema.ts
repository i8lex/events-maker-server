import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

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
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User' },
        type: String,
        text: {
          type: String,
          minlength: 1,
          maxlength: 500,
        },
        image: {
          name: String,
          buffer: String,
          thumbBuffer: String,
          mimeType: String,
        },
        audio: {
          name: String,
          buffer: String,
          mimeType: String,
        },
        video: {
          name: String,
          link: String,
        },
        created: Date,
      },
    ],
  })
  @ApiProperty({
    example: [
      {
        user: 'user-id',
        type: 'text',
        text: 'Chat message',
        created: '2023-09-23T12:00:00Z',
      },
    ],
    description: 'Array of chat messages',
  })
  messages: {
    user: Types.ObjectId;
    type: string;
    text?: string;
    image?: {
      name: string;
      buffer: string;
      thumbBuffer: string;
      mimeType: string;
    };
    audio?: {
      name: string;
      buffer: string;
      mimeType: string;
    };
    video?: {
      name: string;
      link: string;
    };
    created: Date;
  }[];

  @Prop()
  @ApiProperty({
    example: '2023-09-23T12:00:00Z',
    description: 'Date of Creation',
  })
  created: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
