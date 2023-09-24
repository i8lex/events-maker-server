import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserRegisterResponseDTO {
  @ApiProperty({
    description: 'The email of the user.',
    example: 'example@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Registration response.',
    example: 'User successfully registered',
  })
  message: string;
}
