import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/common/dtos/user.dtos';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { CredentialsDto } from 'src/common/dtos/credentials.dto';
import { UserDocument } from 'src/common/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    if ((await this.checkUserExist(createUserDto.email)).userExist) {
      this.logger.error('User already exist', 'AuthService');
      throw new ConflictException('User already exist');
    }

    const { password, ...rest } = createUserDto;
    return await this.usersService.create({
      password: await argon2.hash(password),
      ...rest,
    });
  }

  async signin(credentials: CredentialsDto) {
    const user = await this.usersService.findByEmail(credentials.email);
    if (!user || !(await argon2.verify(user.password, credentials.password))) {
      this.logSignUpError(user, credentials.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    user.access_token = this.getToken(user.uuid, user.email);
    return user;
  }

  async checkUserExist(email: string) {
    const user = await this.usersService.findByEmail(email);
    return { user, userExist: !!user };
  }

  private logSignUpError(user: UserDocument | null, email: string): void {
    this.logger.error(
      `WRONG CREDENTIALS: ${
        user ? 'Invalid password' : `No user with given email: ${email}`
      }`,
      this.constructor.name,
    );
  }

  private getToken(uuid: string, email: string) {
    this.logger.log('Signing token for user: ' + email, 'AuthService');
    const token = this.jwtService.sign(
      { uuid, email },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
      },
    );
    return token;
  }
}
