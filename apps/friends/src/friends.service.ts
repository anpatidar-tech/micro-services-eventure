import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Friend } from './schema/friend.schema';
import { User } from 'apps/users-service/src/schemas/user.schema';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friend.name) private readonly friendModel: Model<Friend>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async addFriend(userId: string, friendId: string) {
    if (userId === friendId)
      throw new RpcException("You can't add yourself");

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const friend = await this.userModel.findById(friendId);
    if (!friend) throw new NotFoundException('Friend not found');

    const exists = await this.friendModel.findOne({
      user: userId,
      friend: friendId,
    });
    if (exists) throw new RpcException('Already friends');

    await this.friendModel.create([
      { user: userId, friend: friendId },
      { user: friendId, friend: userId },
    ]);

    return { message: 'Friend added successfully' };
  }

  async listFriends(userId: string) {
    const friends = await this.friendModel
      .find({ user: userId })
      .populate('friend', 'name email');

    return friends.map((f) => f.friend);
  }

  async isFriend({ userId, friendId }) {
   const res = await this.friendModel.find({
      user: userId,
      friend: friendId,
    });

    return res;
  }
}
