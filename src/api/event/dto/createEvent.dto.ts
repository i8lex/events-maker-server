import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiResponseProperty({ example: 'abcd' })
  _id: string;

  @ApiProperty({
    description: 'Event title',
    example: 'Event Title',
  })
  title: string;

  @ApiProperty({
    description: 'Event description',
    example: 'Event Description',
  })
  description: string;
}
