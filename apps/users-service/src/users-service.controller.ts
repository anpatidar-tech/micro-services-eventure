import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users-service.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create-user' })
  createUser(@Payload() data: RegisterDto) {
    return this.usersService.create(data);
  }

  @MessagePattern({ cmd: 'update-user' })
  updateUser(@Payload() data: { id: string; updateDto: UpdateUserDto }) {
    return this.usersService.update(data.id, data.updateDto);
  }

  @MessagePattern({ cmd: 'get-all-users' })
  getAllUsers() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'find-user-by-email' })
  findByEmail(@Payload() email: string) {
    return this.usersService.findByEmail(email);
  }

  @MessagePattern({ cmd: 'find-user-by-id' })
  findById(@Payload() id: string) {
    return this.usersService.findById(id);
  }




}
