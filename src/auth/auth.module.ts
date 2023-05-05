import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './access-token.strategy';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [UsersModule, ConfigModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, Logger, JwtStrategy, RolesGuard],
})
export class AuthModule {}
