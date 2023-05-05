import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { Role } from '../types/roles.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Exclude()
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, unique: true })
  uuid: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Exclude()
  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  roles: Role[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  updatedAt: Date | null;

  @Prop()
  access_token: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
