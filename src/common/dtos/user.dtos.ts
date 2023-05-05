import { IsEmail, IsNotEmpty } from 'class-validator';
import { ReadOnly } from '../decorators/readonly.decorator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ReadOnly()
  email: string;

  @ReadOnly()
  password: string;
}
