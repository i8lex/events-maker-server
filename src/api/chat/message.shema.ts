import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Message extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  @ApiProperty({ example: 'user-id', description: 'User ID' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Chat' })
  @ApiProperty({ example: 'acuhoewoeuvhs923r62k', description: 'Chat ID' })
  chatId: Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty({ example: 'Username', description: 'This name of the user' })
  username: string;

  @Prop({ required: true })
  @ApiProperty({ example: 'text', description: 'This is the message type' })
  messageType: string;

  @Prop()
  @ApiProperty({
    example: 'Some text',
    description: 'This is the message text',
  })
  message: string;

  @Prop({ type: Object })
  image: {
    name: string;
    buffer: string;
    thumbBuffer: string;
    mimeType: string;
  };

  @Prop({ type: Object })
  audio: {
    name: string;
    buffer: string;
    mimeType: string;
  };

  @Prop({ type: Object })
  video: {
    name: string;
    link: string;
  };
  @Prop({ type: [Types.ObjectId], default: [], ref: 'User' })
  readBy: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [] })
  deliveredTo: Types.ObjectId[];

  @Prop({ required: true, default: new Date() })
  created: Date;
}

export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);
