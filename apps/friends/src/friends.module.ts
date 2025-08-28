import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { User, UserSchema } from 'apps/users-service/src/schemas/user.schema';
import { Friend, FriendSchema } from './schema/friend.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:27017/event_microservice_users',
    ),
    MongooseModule.forFeature([
      { name: Friend.name, schema: FriendSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
