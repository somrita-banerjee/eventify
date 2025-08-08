import { Body, Controller, Get, Param, Post, Patch, Delete } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './events.dto';
import type { JwtUser } from 'src/decorator/userFromAuth.decorator';
import { UserFromAuth } from 'src/decorator/userFromAuth.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  @Post()
  create(
    @Body() createEventDto: CreateEventDto,
    @UserFromAuth() user: JwtUser,
  ) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id') 
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string,
    @Body() updateEventDto: CreateEventDto,
    user: JwtUser) {
    return this.eventsService.update(id, updateEventDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserFromAuth() user: JwtUser) {
    return this.eventsService.delete(id, user);
  }
}
