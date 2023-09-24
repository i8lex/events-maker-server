import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Event extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name })
  @ApiProperty({ example: '650c0f1fcaece6ddbc7abdss8', description: 'User ID' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Chat' })
  @ApiProperty({ example: 'chat-id', description: 'Chat ID' })
  chat: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: User.name })
  @ApiProperty({
    example: ['650c0f1fcaece6ddbc7abdss8', '650c0f1fcaece6ddbc7abdss8'],
    description: 'Array of User IDs',
  })
  users: Types.ObjectId[];

  @Prop()
  @ApiProperty({ example: 'Event Title', description: 'Event Title' })
  title: string;

  @Prop()
  @ApiProperty({
    example: 'Event Description',
    description: 'Event Description',
  })
  description: string;

  @Prop({ type: [Types.ObjectId], ref: 'Image' })
  @ApiProperty({
    example: ['650c0f1fcaece6ddbc7abdss8', '650c0f1fcaece6ddbc7abdss8'],
    description: 'Array of Image IDs',
  })
  images: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Audio' })
  @ApiProperty({
    example: ['650c0f1fcaece6ddbc7abdss8', '650c0f1fcaece6ddbc7abdss8'],
    description: 'Array of Audio IDs',
  })
  audios: Types.ObjectId[];

  @Prop()
  @ApiProperty({
    example: [
      { name: '650c0f1fcaece6ddbc7abdss8', link: '650c0f1fcaece6ddbc7abdss8' },
    ],
    description: 'Array of Video Objects',
  })
  videos: {
    name: string;
    link: string;
  }[];

  @Prop()
  @ApiProperty({ example: 'private', description: 'Event Privacy' })
  isPrivate: string;

  @Prop({ default: false })
  @ApiProperty({ example: false, description: 'Event Status (Done/Not Done)' })
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
    description: 'Event Deadline',
  })
  deadline: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
