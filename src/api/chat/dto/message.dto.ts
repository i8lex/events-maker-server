import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class MessageDto {
  @ApiResponseProperty({ example: 'uqhcalcdg23r234397' })
  _id: string;

  @ApiProperty({
    description: 'The id of the message.',
    example: 'uqhcalcdg23r234397',
  })
  messageId?: Types.ObjectId;

  @ApiProperty({
    description: 'The id of the user.',
    example: 'uqhcalcdg23r234397',
  })
  username: string;

  @ApiProperty({
    description: 'The id of the user.',
    example: 'Root445',
  })
  userId: Types.ObjectId;

  @ApiProperty({
    description: 'The id of the users for delivery.',
    example: 'Root445',
  })
  users: string[];

  @ApiProperty({
    description: 'The id of the chat.',
    example: 'uqhcalcdg23r234397',
  })
  chatId: string;

  @ApiProperty({
    description: 'The id of the chat.',
    example: 'text',
  })
  messageType: string;

  @ApiProperty({
    description: 'Some message',
    example: 'Hello world!',
  })
  message: string;

  @ApiProperty({
    description: 'This message my been deleted for this users',
    example: ['uqhcalcdg23r234397', 'uqhcalcdg23r234397'],
  })
  isDeletedFor: string[];

  @ApiProperty({
    description: 'This message my been read by this users',
    example: ['uqhcalcdg23r234397', 'uqhcalcdg23r234397'],
  })
  readBy: Types.ObjectId[];

  @ApiProperty({
    description: 'Type of action',
    example: ['deliver'],
  })
  event?: 'deliver' | 'read';
}
