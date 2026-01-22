import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../model/jwt-payload.type';
import { UserRole } from '../model/user-role.enum';

@Injectable()
export class JwtAuthAdminGuard extends AuthGuard('jwt') {
  handleRequest<TUser = JwtPayload>(
    err: unknown,
    user: TUser | false,
    info: any,
    context: ExecutionContext,
  ) {
    if (err || !user) {
      throw new UnauthorizedException();
    }

    if ((user as unknown as JwtPayload).role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Admin access required');
    }

    return user;
  }
}
