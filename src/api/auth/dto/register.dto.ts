import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class RegisterUserDTO {
  @ApiProperty({ example: 'root1234@root.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'Root1234', description: 'User password' })
  @IsNotEmpty()
  @Length(8, 50, { message: 'Password must be between 8 and 50 characters' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, {
    message:
      'Password must contain at least one digit, one lowercase and one uppercase letter',
  })
  readonly password: string;

  @ApiProperty({ example: 'civil446', description: 'User name' })
  @IsNotEmpty()
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  readonly name: string;
}
