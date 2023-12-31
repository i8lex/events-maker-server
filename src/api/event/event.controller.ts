import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Request,
  Body,
  UseGuards,
  Post,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './event.schema';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/api/auth/guards/jwt-auth.guard';
import { CreateEventDto } from './dto/createEvent.dto';

@Controller('events')
@ApiTags('events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, description: 'OK', type: Event, isArray: true })
  async findAllEvents(@Request() request): Promise<Event[]> {
    return this.eventService.findAllEventsByOwner(request);
  }

  @Post()
  @ApiOperation({ summary: 'Create event' })
  @ApiResponse({ status: 200, description: 'OK', type: Event, isArray: true })
  async createEvent(
    @Request() request,
    @Body() event: CreateEventDto,
  ): Promise<Event> {
    return this.eventService.createEvent(request, event);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a event by ID' })
  @ApiResponse({ status: 200, description: 'OK', type: Event })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findById(@Param('id') id: string): Promise<Event> {
    return this.eventService.findEventById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an event by ID' })
  @ApiResponse({ status: 200, description: 'OK', type: Event })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async updateEvent(
    @Request() request,
    @Param('id') id: string,
    @Body() updateEvent: Partial<Event>,
  ): Promise<{ message: string }> {
    return this.eventService.updateEvent(request, id, updateEvent);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event by ID' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async deleteEvent(@Param('id') id: string): Promise<void> {
    return this.eventService.deleteEvent(id);
  }
}
