import { ExecutionContext , UnauthorizedException  } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";

export interface AuthUser {
    sub: number;
    refreshToken?: string;
}

export const CurrentUser = createParamDecorator((_data : unknown, context : ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    
    if (!request.user?.sub) {
        throw new UnauthorizedException('Invalid user payload');
    }
    
    return request.user;
})