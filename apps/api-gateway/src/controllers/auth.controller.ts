import {
  Controller,
  Post,
  Body,
  Inject,
  HttpException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    schema: { example: { email: 'test@test.com', password: '123456' } },
  })
  async login(@Body() body: any) {
    try {
      return await lastValueFrom(
        this.authClient.send({ cmd: 'auth-login' }, body),
      );
    } catch (err: any) {
      const error = err?.response || err;

      throw new HttpException(
        {
          statusCode: error.statusCode || 500,
          message: error.message || 'Something went wrong',
        },
        error.statusCode || 500,
      );
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({
    schema: {
      example: { email: 'user@test.com', name: 'test', password: '123456' },
    },
  })
  async register(@Body() body: any) {
    try {
      return await lastValueFrom(
        this.authClient.send({ cmd: 'auth-register' }, body),
      );
    } catch (err: any) {
      const error = err?.response || err;

      throw new HttpException(
        {
          statusCode: error.statusCode || 500,
          message: error.message || 'Something went wrong',
        },
        error.statusCode || 500,
      );
    }
  }
}
