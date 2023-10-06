import { ApiProperty } from '@nestjs/swagger';
import { Message } from '../message.shema';
import { Types } from 'mongoose';

export class ChatDto {
  @ApiProperty({ description: 'Chat Id', example: 'uqhcalcdg23r234397' })
  _id: Types.ObjectId;

  @ApiProperty({ example: 'Tess room', description: 'The title of the chat' })
  title: string;

  @ApiProperty({
    description: 'The id of the users in this chat.',
    example: 'uqhcalcdg23r234397',
  })
  user: Types.ObjectId;

  @ApiProperty({
    description: 'The id of the users in this chat.',
    example: ['uqhcalcdg23r234397', 'uqhcalcdg23r234397'],
  })
  users: Types.ObjectId[];

  @ApiProperty({ example: ['Root12', 'Root13'], description: 'Names of users' })
  userNames: string[];

  @ApiProperty({
    description: 'Some message',
    example: 'Hello world!',
  })
  messages: Message[];

  @ApiProperty({ example: 'event-id', description: 'Event ID' })
  event: Types.ObjectId;

  @ApiProperty({ example: 'task-id', description: 'Task ID' })
  task: Types.ObjectId;

  @ApiProperty({ example: 'microtask-id', description: 'Microtask ID' })
  microtask: Types.ObjectId;

  @ApiProperty({
    example: '2023-09-23T12:00:00Z',
    description: 'Date of Creation',
  })
  created: Date;
}
