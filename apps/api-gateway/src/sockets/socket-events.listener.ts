import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketEventsListener {
  constructor(private readonly socketGateway: SocketGateway) {}

  @EventPattern('event-created')
  handleEventCreated(@Payload() data: any) {
    console.log('Event Created:', data);
    this.socketGateway.sendEventCreated(data.friendIds, data);
  }

  @EventPattern('leaderboard-updated')
  handleLeaderboardUpdate(@Payload() data: any) {
    console.log('Leaderboard Updated:', data);
    this.socketGateway.sendLeaderboardUpdate(data.creatorId, data);
  }
}
