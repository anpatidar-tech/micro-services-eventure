import { Controller, Get, Req, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(@Inject('USERS_SERVICE') private readonly usersClient: ClientProxy) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  getUsers() {
    return this.usersClient.send({ cmd: 'get-all-users' }, {});
  }

  @Get('profile')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile (from JWT)' })
  getProfile(@Req() req: any) {
    return this.usersClient.send({ cmd: 'find-user-by-email' }, req.user.email);
  }
}
