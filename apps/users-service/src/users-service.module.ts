import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users-service.controller';
import { UsersService } from './users-service.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:27017/event_microservice_users',
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
