import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth-service.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth-register' })
  async register(data: CreateUserDto) {
    return this.authService.register(data);
  }

  @MessagePattern({ cmd: 'auth-login' })
  async login(data: LoginDto) {
    return this.authService.login(data);
  }
}
