import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class ImageDto {
  @ApiResponseProperty({ example: 'abcd' })
  _id?: string;

  @ApiProperty({
    description: 'Filename.',
    example: '103.png',
  })
  originalname?: string;

  @ApiProperty({
    description: 'Filename.',
    example: '103.png',
  })
  filename?: string;

  @ApiProperty({
    description: 'Image buffer.',
    example: 'base64/image',
  })
  buffer: string;

  @ApiProperty({
    description: 'The mime-type of the image.',
    example: 'image/png',
  })
  mimetype: string;
}
