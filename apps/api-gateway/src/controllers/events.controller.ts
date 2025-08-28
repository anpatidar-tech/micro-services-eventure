import {
  Controller, Post, Get, Param, Req, Body, Inject, UseGuards,
  BadRequestException, UploadedFile, UseInterceptors
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { lastValueFrom } from 'rxjs';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(@Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy) {}

  @Post('create')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new event with media file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('media', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, callback) => {
      const allowed = ['.jpg', '.jpeg', '.png', '.mp4'];
      const ext = extname(file.originalname).toLowerCase();
      if (!allowed.includes(ext)) return callback(new BadRequestException('Invalid file type'), false);
      callback(null, true);
    },
  }))
  async createEvent(@Req() req, @UploadedFile() file, @Body('title') title: string, @Body('description') description: string) {
    if (!file) throw new BadRequestException('Media file is required');
    return this.eventClient.send({ cmd: 'create-event' }, { userId: req.user.sub, title, description, mediaPath: file.path });
  }

  @Get('my')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  getMyEvents(@Req() req) {
    return this.eventClient.send({ cmd: 'get-my-events' }, { userId: req.user.sub });
  }

  @Get('all')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  getAllEvents() {
    return this.eventClient.send({ cmd: 'get-all-events' }, {});
  }

  @Post('acknowledge/:eventId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'eventId', example: '64f91b1234abcd5678ef9012' })
  async acknowledgeEvent(@Req() req, @Param('eventId') eventId: string) {
    try {
      return await lastValueFrom(this.eventClient.send({ cmd: 'acknowledge-event' }, { userId: req.user.sub, eventId }));
    } catch (err: any) {
      throw new BadRequestException(err.message || 'Acknowledgement failed');
    }
  }

  @Get('leaderboard')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  getLeaderboard(@Req() req) {
    return this.eventClient.send({ cmd: 'get-leaderboard' }, { creatorId: req.user.sub });
  }
}
