import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class User extends Document {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'JohnDoe', description: 'User name' })
  name: string;

  @Prop()
  @IsString()
  @ApiProperty({ example: 'John', description: 'User first name' })
  firstname: string;

  @Prop()
  @IsString()
  @ApiProperty({ example: 'Doe', description: 'User last name' })
  lastname: string;

  @Prop()
  @ApiProperty({ example: '1990-01-01', description: 'User birthday' })
  birthday: string;

  @Prop({ default: 'false' })
  @ApiProperty({ example: 'false', description: 'Is birthday showing' })
  isBirthdayShowing: string;

  @Prop({ default: 'None' })
  @ApiProperty({ example: 'Male', description: 'User gender' })
  gender: string;

  @Prop({ default: 'false' })
  @ApiProperty({ example: 'false', description: 'Is gender showing' })
  isGenderShowing: string;

  @Prop()
  @ApiProperty({ example: 'Company Inc', description: 'User company' })
  company: string;

  @Prop({ default: 'false' })
  @ApiProperty({ example: 'false', description: 'Is company showing' })
  isCompanyShowing: string;

  @Prop()
  @ApiProperty({ example: 'Developer', description: 'User role' })
  role: string;

  @Prop({ default: 'false' })
  @ApiProperty({ example: 'false', description: 'Is role showing' })
  isRoleShowing: string;

  @Prop()
  @ApiProperty({ example: 'About me', description: 'User about' })
  about: string;

  @Prop({ default: 'false' })
  @ApiProperty({ example: 'false', description: 'Is about showing' })
  isAboutShowing: string;

  @Prop({ required: true, unique: true })
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;

  @Prop()
  @ApiProperty({
    example: 'confirmation-code',
    description: 'Confirmation code',
  })
  confirmationCode: string;

  @Prop({ default: false })
  @ApiProperty({ example: false, description: 'Is confirmed' })
  isConfirmed: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Event' })
  @ApiProperty({
    example: ['event-id-1', 'event-id-2'],
    description: 'Array of Event IDs',
  })
  events: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Chat' })
  @ApiProperty({
    example: ['chat-id-1', 'chat-id-2'],
    description: 'Array of Chat IDs',
  })
  createdChats: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Chat' })
  @ApiProperty({
    example: ['chat-id-3', 'chat-id-4'],
    description: 'Array of Chat IDs',
  })
  chats: Types.ObjectId[];

  @Prop({ default: 'false' })
  @ApiProperty({ example: 'false', description: 'Is events showing' })
  isEventsShowing: string;

  @Prop({ type: [Types.ObjectId], ref: 'Task' })
  @ApiProperty({
    example: ['task-id-1', 'task-id-2'],
    description: 'Array of Task IDs',
  })
  tasks: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Microtask' })
  @ApiProperty({
    example: ['microtask-id-1', 'microtask-id-2'],
    description: 'Array of Microtask IDs',
  })
  microtasks: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  @ApiProperty({
    example: ['user-id-1', 'user-id-2'],
    description: 'Array of User IDs',
  })
  connects: Types.ObjectId[];

  @Prop({ default: 'false' })
  @ApiProperty({ example: 'false', description: 'Is connects showing' })
  isConnectsShowing: string;

  @Prop({ type: [Types.ObjectId], ref: 'Image' })
  @ApiProperty({
    example: ['image-1', 'image-2'],
    description: 'Array of Image IDs',
  })
  images: Types.ObjectId[];

  @Prop({
    type: {
      name: String,
      buffer: String,
      thumbBuffer: String,
      mimeType: String,
    },
  })
  @ApiProperty({
    example: {
      name: 'avatar-1',
      buffer: 'image-buffer',
      thumbBuffer: 'thumb-buffer',
      mimeType: 'image/jpeg',
    },
    description: 'User avatar',
  })
  avatar: {
    name: string;
    buffer: string;
    thumbBuffer: string;
    mimeType: string;
  };

  @Prop({ default: 'false' })
  @ApiProperty({ example: 'false', description: 'Is super user' })
  superUser: string;

  @Prop({ type: Date, default: Date.now })
  @ApiProperty({
    example: '2023-09-23T12:00:00Z',
    description: 'Date of Creation',
  })
  created: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
