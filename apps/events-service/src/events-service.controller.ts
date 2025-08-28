import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventsService } from './events-service.service';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @MessagePattern({ cmd: 'create-event' })
  createEvent(
    @Payload()
    data: {
      userId: string;
      title: string;
      description: string;
      mediaPath: string;
    },
  ) {
    return this.eventsService.createEvent(
      data.userId,
      data.title,
      data?.description,
      data.mediaPath,
    );
  }

  @MessagePattern({ cmd: 'get-my-events' })
  getMyEvenent(@Payload() data: { userId: string }) {
    return this.eventsService.getMyEvent(data.userId);
  }

  @MessagePattern({ cmd: 'get-all-events' })
  findAll() {
    return this.eventsService.findAll();
  }

  @MessagePattern({ cmd: 'get-friend-events' })
  getFriendEvents(@Payload() data: { userId: string }) {
    return this.eventsService.getFriendEvents(data.userId);
  }

  @MessagePattern({ cmd: 'acknowledge-event' })
  acknowledge(@Payload() data: { eventId: string; userId: string }) {
    return this.eventsService.acknowledge(data.eventId, data.userId);
  }

  @MessagePattern({ cmd: 'get-leaderboard' })
  getLeaderboard(@Payload() data: { creatorId: string }) {
    return this.eventsService.getLeaderboard(data.creatorId);
  }
}
