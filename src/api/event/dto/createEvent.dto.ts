import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @ApiResponseProperty({ example: 'abcd' })
  id: string;

  @ApiProperty({
    description: 'The first name of the user.',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user.',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'The email of the user.',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
