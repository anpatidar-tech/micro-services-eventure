import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await firstValueFrom(
      this.usersClient.send({ cmd: 'find-user-by-email' }, createUserDto.email),
    );

    if (existingUser) {
      throw new RpcException({
        statusCode: 409,
        message: 'Email already registered',
      });
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await firstValueFrom(
      this.usersClient.send(
        { cmd: 'create-user' },
        { ...createUserDto, password: hashedPassword },
      ),
    );

    const payload = { sub: user._id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'User registered successfully',
      userId: user._id,
      access_token: token,
    };
  }

  async login(body: LoginDto) {
    const user = await firstValueFrom(
      this.usersClient.send({ cmd: 'find-user-by-email' }, body.email),
    );

    if (!user)
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid credentials',
      });

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid)
      throw new RpcException({
        statusCode: 401, // Unauthorized
        message: 'Invalid credentials',
        error: 'Unauthorized',
      });
    const payload = { sub: user._id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
}
