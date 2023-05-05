import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/common/types/jwt.payload';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly logger: Logger,
    private readonly authService: AuthService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    this.logger.log(
      `Validating JWT token for user with email: ${payload.email}`,
      'JwtStrategy',
    );

    const check = await this.authService.checkUserExist(payload.email);
    if (!check.userExist) {
      throw new UnauthorizedException();
    }
    this.logger.log(`success !`, 'JwtStrategy');
    return check.user;
  }
}
