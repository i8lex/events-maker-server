import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class UserLoginResponseDTO {
  @ApiResponseProperty({ example: 'abcd' })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    description: 'The email of the user.',
    example: 'example@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Account activation status.',
    example: 'true',
  })
  isConfirmed: boolean;

  @ApiProperty({
    example: 'string',
  })
  token: string;
}
