import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../types/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly logger: Logger) {}
  canActivate(context: ExecutionContext): boolean {
    this.logger.log('Verifying user roles', 'RolesGuard');
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      this.logger.log('No required roles', 'RolesGuard');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const isAllowed = requiredRoles.some((role) => user.roles?.includes(role));
    this.logInfo(user.email, user.roles, requiredRoles, isAllowed);
    return isAllowed;
  }

  private logInfo(
    email: string,
    roles: Role[],
    requiredRoles: Role[],
    isAllowed: boolean,
  ): void {
    this.logger.log(
      `${email} is ${roles} and required roles are ${requiredRoles}`,
      'RolesGuard',
    );

    isAllowed
      ? this.logger.log('User is allowed: ' + isAllowed, 'RolesGuard')
      : this.logger.error('User is allowed: ' + isAllowed, 'RolesGuard');
  }
}
