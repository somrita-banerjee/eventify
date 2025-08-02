import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserFromAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtUser;
  },
);

export interface JwtUser {
  sub: string;
  iat?: number;
  exp?: number;
}
