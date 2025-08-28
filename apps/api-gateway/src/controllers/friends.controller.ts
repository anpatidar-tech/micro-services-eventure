import { Controller, Post, Body, Req, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Friends')
@Controller('friends')
export class FriendsController {
  constructor(@Inject('FRIEND_SERVICE') private readonly friendClient: ClientProxy) {}

  @Post('add')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a friend by friendId' })
  @ApiBody({ schema: { example: { friendId: '64f91b1234abcd5678ef9012' } } })
  addFriend(@Req() req, @Body() body: any) {
    return this.friendClient.send({ cmd: 'add-friend' }, { userId: req.user.sub, friendId: body.friendId });
  }

  @Post('my')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List my friends' })
  listFriends(@Req() req) {
    return this.friendClient.send({ cmd: 'list-friends' }, { userId: req.user.sub });
  }
}
