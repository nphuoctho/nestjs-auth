import type { Request } from 'express';
import type { User } from '../../db/schema.js';
import { type ExecutionContext, createParamDecorator } from '@nestjs/common';

type RequestWithUser = Request & { user: User };

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
