import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './events.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';
import { JwtUser } from 'src/decorator/userFromAuth.decorator';

@Injectable()
export class EventsService {
  logger = new Logger(EventsService.name);
  constructor(private readonly prismaService: PrismaService) {}
  async createEvent(createEventDto: CreateEventDto) {
    try {
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
    } catch (error) {
      this.logger.error('Error creating Event', error);
      throw new HttpException(
        {
          status: error.status || 500,
          error: error.message || 'Internal server error',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
          description: 'Failed to create event',
        },
      );
    }
  }
  async findAll() {
    try {
      const event = await this.prismaService.events.findMany();
      return event;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || 500,
          error: error.message || 'Internal Sever Error',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
          description: 'Failed to retreive events',
        },
      );
    }
  }
  async findOne(id: string) {
    try {
      const event = await this.prismaService.events.findUnique({
        where: { id },
      });
      if (!event) {
        throw new NotFoundException(`Event with id ${id} not found`);
      }
      return event;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || 500,
          error: error.message || 'Internal server error',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
          description: 'Failed to retreive event',
        },
      );
    }
  }
  async update(id: string, updateeventdto: CreateEventDto, user: JwtUser) {
      try {
          const event = await this.prismaService.events.findUnique({
              where: { id },
          });
          if (!event) {
              throw new NotFoundException(`Event with id ${id} not found`);
          }
          const updateBody = {
              title: updateeventdto.title,
              description: updateeventdto.description,
              start_time: updateeventdto.start_time,
              end_time: updateeventdto.end_time,
          };
          return this.prismaService.events.update({
              where: { id },
              data: updateBody,
          });
      } catch (error) {
          throw new HttpException({
              status: error.status || 500,
              error: error.message || 'Internal server error',
          },
              HttpStatus.BAD_REQUEST,
              {
                  cause: error,
                  description: 'Failed to update event',
              },
          );
    }
  }
    async delete(id: string, user: JwtUser) {
      try {
          const event = await this.prismaService.events.findUnique({
              where: { id },
          });
          if (!event) {
              throw new NotFoundException('Event not found');
          }
          return await this.prismaService.events.delete({
              where: { id },
          });
      } catch (error) {
          throw new HttpException(
              {
                  status: error.status || 500,
                  error: error.message || 'Internal server error',
              },
              HttpStatus.BAD_REQUEST,
              {
                  cause: error,
                  description: 'Failed to delete event',
              },
          );
      }
  }
}
