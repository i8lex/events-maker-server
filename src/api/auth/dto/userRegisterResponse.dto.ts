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
  @ApiProperty({
    description: 'Registered username.',
    example: 'Root1234',
  })
  name?: string;
  @ApiProperty({
    description: 'Token for confirm email address.',
    example: 'JWT',
  })
  token?: string;
}
