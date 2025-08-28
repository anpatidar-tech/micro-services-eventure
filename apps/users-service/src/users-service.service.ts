import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const newUser = new this.userModel({ ...registerDto });
    return newUser.save();
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<User | null> {
    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }
    return this.userModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}
