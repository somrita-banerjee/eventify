import { Body, Controller, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateEventDto } from './events.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {
  }
  @ApiOperation({ summary: 'Create Event' })
  @Post('create')
  async createEvent(@Body() body: CreateEventDto) {
    return await this.eventsService.createEvent(body);
  }
}
