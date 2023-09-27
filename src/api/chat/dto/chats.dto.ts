import { ApiProperty } from '@nestjs/swagger';

export class ChatsDto {
  @ApiProperty({ description: 'Chat Id', example: 'uqhcalcdg23r234397' })
  _id: string;

  @ApiProperty({
    description: 'The id of the users in this chat.',
    example: ['uqhcalcdg23r234397', 'uqhcalcdg23r234397'],
  })
  users: string[];

  @ApiProperty({
    description: 'The name of the users in this chat.',
    example: ['Root445', 'Root446'],
  })
  usernames: string[];

  @ApiProperty({
    description: "Quantity of don't read messages in this chat.",
    example: 3,
  })
  unRead: number;

  @ApiProperty({
    description: 'Quantity of  messages in this chat.',
    example: 3,
  })
  messageQuantity: string;

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
  readBy: string[];
}
