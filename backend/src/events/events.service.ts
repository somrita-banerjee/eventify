import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './events.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';


@Injectable()
export class EventsService {
    constructor(private readonly prismaService: PrismaService ) {}
    async createEvent(createEventDto: CreateEventDto) {
        const event = await this.prismaService.events.create({
            data: {
                id: uuid(),
                title: createEventDto.title,
                description: createEventDto.description,
                start_time: createEventDto.start_time,
                end_time: createEventDto.end_time,
                location: '',
            },
        });
        return event;
     }
}
