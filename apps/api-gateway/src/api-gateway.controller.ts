import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  UseGuards,
  Req,
  Param,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { lastValueFrom } from 'rxjs';

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    @Inject('FRIEND_SERVICE') private readonly friendClient: ClientProxy,
    @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy,
  ) {}

  // Auth service
  //-------------------------
  @ApiTags('Auth')
  @Post('auth/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    schema: { example: { email: 'testw@test.com', password: '123456' } },
  })
  async login(@Body() body: any) {
    return this.authClient.send({ cmd: 'auth-login' }, body);
  }

  @ApiTags('Auth')
  @Post('auth/register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({
    schema: {
      example: { email: 'testq@test.com', name: 'test', password: '123456' },
    },
  })
  async register(@Body() body: any) {
    return this.authClient.send({ cmd: 'auth-register' }, body);
  }

  // User service
  //-------------------------
  @ApiTags('Users')
  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  async getUsers() {
    return this.usersClient.send({ cmd: 'get-all-users' }, {});
  }

  @ApiTags('Users')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile (from JWT)' })
  getProfile(@Req() req: any) {
    return this.usersClient.send({ cmd: 'find-user-by-email' }, req.user.email);
  }

  // Friends service
  //-------------------------
  @ApiTags('Friends')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('friends/add')
  @ApiOperation({ summary: 'Add a friend by friendId' })
  @ApiBody({
    schema: {
      example: { friendId: '64f91b1234abcd5678ef9012' },
    },
  })
  addFriend(@Req() req, @Body() body: any) {
    return this.friendClient.send(
      { cmd: 'add-friend' },
      {
        userId: req.user.sub,
        friendId: body.friendId,
      },
    );
  }

  @ApiTags('Friends')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('my-friends')
  @ApiOperation({ summary: 'Add a friend by friendId' })
  friendList(@Req() req) {
    return this.friendClient.send(
      { cmd: 'list-friends' },
      {
        userId: req.user.sub,
      },
    );
  }

  // Event service
  // --------------------
  @ApiTags('Events')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('events/create')
  @ApiOperation({ summary: 'Create a new event with media file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'media'],
      properties: {
        title: { type: 'string', example: 'Birthday Party' },
        description: { type: 'string', example: 'At my place' },
        media: {
          type: 'string',
          format: 'binary',
          description: 'Media file (image or video)',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('media', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.mp4'];
        const ext = extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) {
          return callback(new BadRequestException('Invalid file type'), false);
        }
        callback(null, true);
      },
    }),
  )
  async createEvent(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    if (!file) {
      throw new BadRequestException('Media file is required');
    }

    return this.eventClient.send(
      { cmd: 'create-event' },
      {
        userId: req.user.sub,
        title,
        description,
        mediaPath: file.path,
      },
    );
  }

  @ApiTags('Events')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('events/my')
  @ApiOperation({ summary: 'Get my events' })
  getMyEvents(@Req() req) {
    return this.eventClient.send(
      { cmd: 'get-my-events' },
      { userId: req.user.sub },
    );
  }

  @ApiTags('Events')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('events/all')
  @ApiOperation({ summary: 'Get all events' })
  getAllEvents() {
    return this.eventClient.send({ cmd: 'get-all-events' }, {});
  }

  @ApiTags('Events')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('events/acknowledge/:eventId')
  @ApiOperation({ summary: 'Acknowledge an event' })
  @ApiParam({ name: 'eventId', example: '64f91b1234abcd5678ef9012' })
  async acknowledgeEvent(@Req() req, @Param('eventId') eventId: string) {
    try {
      return await lastValueFrom(
        this.eventClient.send(
          { cmd: 'acknowledge-event' },
          { userId: req.user.sub, eventId },
        ),
      );
    } catch (err: any) {
      throw new BadRequestException(err.message || 'Acknowledgement failed');
    }
  }

  @ApiTags('Events')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('events/leaderboard')
  @ApiOperation({
    summary: 'Get leaderboard (based on friend acknowledgements)',
  })
  getLeaderboard(@Req() req) {
    return this.eventClient.send(
      { cmd: 'get-leaderboard' },
      { creatorId: req.user.sub },
    );
  }
}
