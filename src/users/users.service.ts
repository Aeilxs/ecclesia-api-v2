import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, UpdateUserDto } from '../common/dtos/user.dtos';
import { Model } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';
import { Role } from 'src/common/types/roles.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    user.uuid = uuidv4();
    user.roles = [Role.ROLE_USER];
    user.createdAt = new Date();
    user.updatedAt = null;
    return await this.userModel.create(user);
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.findOne(id);
    Object.assign(updatedUser, updateUserDto);
    updatedUser.updatedAt = new Date();
    return updatedUser.save();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
