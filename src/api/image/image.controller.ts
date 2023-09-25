import {
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
  Post,
  UploadedFiles,
  UseInterceptors,
  Put,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ImageService } from './image.service';
import { Image } from './image.schema';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/api/auth/guards/jwt-auth.guard';
import { Thumb } from './thumb.schema';

@Controller('images')
@ApiTags('images')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('thumbs/:eventId')
  @ApiOperation({ summary: 'Get all thumbnails' })
  @ApiResponse({ status: 200, description: 'OK', type: Event, isArray: true })
  async getAllThumbsByEvent(
    @Param('eventId') eventId: string,
  ): Promise<Thumb[]> {
    return this.imageService.findAllThumbsByEvent(eventId);
  }

  @Get(':imageId')
  @ApiOperation({ summary: 'Get image by ID' })
  @ApiResponse({ status: 200, description: 'OK', type: Event, isArray: true })
  async getImage(@Param('imageId') imageId: string): Promise<Image> {
    return this.imageService.findImageById(imageId);
  }

  @Post(':eventId')
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Upload an image to event' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async uploadImages(
    @UploadedFiles() images,
    @Request() request,
    @Param('eventId') eventId: string,
  ): Promise<{ message: string }> {
    return this.imageService.uploadImages(images, request, eventId);
  }

  @Put('delete')
  @ApiOperation({ summary: 'Delete an image by ID' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async deleteImage(
    @Request() request,
    @Body() imageIds: string[],
  ): Promise<{
    deletedCount: number;
    message: string;
  }> {
    console.log('imageIds: ', imageIds);
    return this.imageService.deleteImage(request, imageIds);
  }
}
