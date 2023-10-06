import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UserDTO {
  @ApiProperty({ example: '1', description: 'User ID' })
  _id?: Types.ObjectId;

  @ApiProperty({ example: 'John', description: 'First name' })
  name?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  firstname?: string;

  @ApiProperty({ example: 'Smith', description: 'Last name' })
  lastname?: string;

  @ApiProperty({ example: '1990-01-01', description: 'Date of birth' })
  birthday?: string;

  @ApiProperty({ example: 'true', description: 'Flag to show birthday' })
  isBirthdayShowing?: string;

  @ApiProperty({ example: 'Male', description: 'Gender' })
  gender?: string;

  @ApiProperty({ example: 'true', description: 'Flag to show gender' })
  isGenderShowing?: string;

  @ApiProperty({ example: 'Company Inc.', description: 'Company name' })
  company?: string;

  @ApiProperty({ example: 'true', description: 'Flag to show company' })
  isCompanyShowing?: string;

  @ApiProperty({ example: 'Admin', description: 'User role' })
  role?: string;

  @ApiProperty({ example: 'true', description: 'Flag to show user role' })
  isRoleShowing?: string;

  @ApiProperty({ example: 'A brief introduction', description: 'User bio' })
  about?: string;

  @ApiProperty({
    example: ['friend1', 'friend2'],
    description: 'List of connections',
  })
  connects?: string[];

  @ApiProperty({ example: 'true', description: 'Flag to show connections' })
  isConnect?: string;

  @ApiProperty({ example: 'true', description: 'Flag to show user bio' })
  isAboutShowing?: string;

  @ApiProperty({
    example: 'true',
    description: 'Flag to show connections list',
  })
  isConnectsShowing?: string;

  @ApiProperty({ example: 'true', description: 'Flag to show user events' })
  isEventsShowing?: string;

  @ApiProperty({
    example: {
      name: 'avatar.jpg',
      buffer: 'base64encodedimage',
      mimeType: 'image/jpeg',
    },
    description: 'User avatar',
  })
  avatar?: {
    name: string;
    buffer: string;
    mimeType: string;
  };

  @ApiProperty({ example: 'false', description: 'It is user online status ' })
  isOnline?: boolean;
}
