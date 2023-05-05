import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/common/dtos/user.dtos';
import { User, UserDocument } from 'src/common/schemas/user.schema';
import MongooseClassSerializerInterceptor from 'src/common/interceptors/mongooseClassSerializer.interceptor';
import { CredentialsDto } from 'src/common/dtos/credentials.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';

@Controller('auth')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() credentialsDto: CredentialsDto) {
    return this.authService.signin(credentialsDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  protectedRoute(@Req() req: { user: UserDocument }) {
    return req.user;
  }
}
