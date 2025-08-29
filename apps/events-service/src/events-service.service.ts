import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Event, EventDocument } from './schema/event.schema';
import { create } from 'domain';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    @Inject('FRIEND_SERVICE') private friendClient: ClientProxy,
    @Inject('GATEWAY_SERVICE') private readonly gatewayClient: ClientProxy,
  ) {}

  async createEvent(
    userId: string,
    title: string,
    description: string,
    mediaPath: string,
  ) {
    if (!title || !mediaPath) {
      throw new RpcException('Title and media are required');
    }

    const newEvent = new this.eventModel({
      title,
      description,
      media: mediaPath,
      creator: userId,
    });


    const friends = await lastValueFrom(
      this.friendClient.send({ cmd: 'get-friends' }, { userId }),
    );

    this.gatewayClient.emit('event-created', {
      friendIds:friends.map((f: any) => f.friendId || f.friend),
      ...newEvent,
    });

    return newEvent.save();
  }

  async getMyEvent(userId: string) {
    if (!userId) {
      throw new RpcException('User ID is required');
    }
    return this.eventModel.find({ creator: userId });
  }

  async findAll() {
    return this.eventModel.find();
  }

  async getFriendEvents(userId: string) {
    const friends = await lastValueFrom(
      this.friendClient.send({ cmd: 'get-friends' }, { userId }),
    );

    if (!friends || !friends.length) {
      return [];
    }

    const friendIds = friends.map((f: any) => f.friendId || f.friend);

    return this.eventModel
      .find({ creator: { $in: friendIds } })
      .sort({ createdAt: -1 })
      .exec();
  }

  async acknowledge(eventId: string, userId: string) {
    const event = await this.eventModel.findById(eventId);

    if (!event) throw new RpcException('Event not found');

    if (event.creator === userId) {
      throw new RpcException('You cannot acknowledge your own event');
    }

    if (event.acknowledgers.find((a) => a.user === userId)) {
      throw new RpcException('Already acknowledged this event');
    }

    const friendship = await lastValueFrom(
      this.friendClient.send(
        { cmd: 'check-friendship' },
        { userId, friendId: event.creator },
      ),
    );

    if (!friendship) {
      throw new RpcException('You are not a friend of the creator');
    }

    const order = event.acknowledgers.length + 1;
    const points = Math.max(100 - (order - 1) * 10, 10);

    event.acknowledgers.push({ user: userId, order, points });
    await event.save();

    this.gatewayClient.emit('leaderboard-updated', {
      creator: event.creator.toString(),
      eventId: event._id,
      createdAt: event.createdAt,
    });

    return { message: 'Event acknowledged', pointsEarned: points };
  }

  async getLeaderboard(creatorId: string) {
    const events = await this.eventModel.find({ creator: creatorId });

    const scores: Record<string, number> = {};

    for (const event of events) {
      for (const ack of event.acknowledgers) {
        scores[ack.user] = (scores[ack.user] || 0) + ack.points;
      }
    }

    const leaderboard = await Promise.all(
      Object.entries(scores).map(async ([userId, points]) => {
        const user = await lastValueFrom(
          this.userClient.send({ cmd: 'find-user-by-id' }, userId),
        );

        return {
          friendId: userId,
          name: user?.name,
          email: user?.email,
          points,
        };
      }),
    );

    return leaderboard.sort((a, b) => b.points - a.points);
  }
}
