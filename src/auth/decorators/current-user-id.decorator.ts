import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../model/jwt-payload.type';
import type { Request } from 'express';

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request: Request = ctx.switchToHttp().getRequest();
    return (request.user as JwtPayload).userId;
  },
);
