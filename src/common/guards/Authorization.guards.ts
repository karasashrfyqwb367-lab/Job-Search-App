import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/common/enum/enum';

export const Roles = (roles: RoleEnum[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleEnum[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) return true; 

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('User not authorized');
    }

    const hasRole = roles.includes(user.role as RoleEnum);
    if (!hasRole) {
      throw new ForbiddenException('User does not have required role');
    }

    return true;
  }
}
