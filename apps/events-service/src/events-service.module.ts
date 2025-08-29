import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schema/event.schema';
import { User, UserSchema } from './schema/user.schema';
import { Friend, FriendSchema } from './schema/friend.schema';
import { EventsController } from './events-service.controller';
import { EventsService } from './events-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:27017/event_microservice_users',
    ),

    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      // TODO: Do not need here
      // { name: User.name, schema: UserSchema },
      // { name: Friend.name, schema: FriendSchema },
    ]),

    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
      {
        name: 'FRIEND_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
       {
        name: 'GATEWAY_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
