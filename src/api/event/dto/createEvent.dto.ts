import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiResponseProperty({ example: 'abcd' })
  _id: string;

  @ApiProperty({
    description: 'The first name of the user.',
    example: 'John',
  })
  title: string;

  @ApiProperty({
    description: 'The last name of the user.',
    example: 'Doe',
  })
  description: string;
}
