import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ').pop();

    const isValidToken = await this.jwtService
      .verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      })
      .catch((error) => {
        if (error === 'jwt expired') return false;
        if (error === 'invalid signature') return false;
      });
    if (!isValidToken)
      throw new UnauthorizedException('Access denied invalid token');

    const isUser = await this.userService.findUserByQuery({
      $and: [
        {
          email: isValidToken.email,
        },
      ],
    });

    if (!isUser)
      throw new UnauthorizedException('Access denied no user exists');

    if (isUser.activeSessionToken != token)
      throw new UnauthorizedException('Access denied invalid token');

    request.user = isUser;
    return true;
  }
}
