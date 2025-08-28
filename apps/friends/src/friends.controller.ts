import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FriendsService } from './friends.service';

@Controller()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @MessagePattern({ cmd: 'add-friend' })
  addFriend(@Payload() data: { userId: string; friendId: string }) {

    return this.friendsService.addFriend(data.userId, data.friendId);
  }

  @MessagePattern({ cmd: 'list-friends' })
  listFriends(@Payload() data: { userId: string }) {
    return this.friendsService.listFriends(data.userId);
  }


  @MessagePattern({cmd:'check-friendship'})
  checkFriend(@Payload() data:{userId:string,friendId:string}){
    return this.friendsService.isFriend(data);
  }


}
