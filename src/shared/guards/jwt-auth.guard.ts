import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthTokenBlackListService } from "src/application/services/authTokenBlacklist.service"; 
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { errorResponse } from "../helpers/response.helper";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
    constructor(
        private tokenBlackListService : AuthTokenBlackListService,
        private jwtService : JwtService,
        private reflector: Reflector,
    ){
        super();
    }

    private extractToken (request : Request) {
        const authHeader = request.headers['authorization'];
        if(!authHeader){
            throw new UnauthorizedException(
                errorResponse('لم يتم إرسال بيانات التفويض',401),
            );
        }

        const [type ,token] = authHeader.split(' ');
        if(type !== 'Bearer' || !token){
            throw new UnauthorizedException(
                errorResponse('تنسيق التوكن غير صالح',401),
            );
        }

        return token;
    }
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      // 1. Check if route is public
      if (this.isPublicRoute(context)) {
        return true;
      }
  
      const request = this.getRequest(context);
  
      // 2. Extract and validate token
      const token = this.extractToken(request);
      const payload = this.verifyToken(token);
      const userId = payload.sub;
  
      // 3. Check if token is blacklisted
      await this.ensureTokenNotBlacklisted(userId, token);
  
      // 5. Proceed with default canActivate (calls passport strategy)
      return super.canActivate(context) as Promise<boolean>;
    }
  
    private isPublicRoute(context: ExecutionContext): boolean {
      return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    }
  
    public getRequest(context: ExecutionContext): Request {
      return context.switchToHttp().getRequest();
    }
  
    private verifyToken(token: string): any {
      try {
        return this.jwtService.verify(token, {
          secret: process.env.JWT_TOKEN_SECRET,
          ignoreExpiration: true,
        });
      } catch (err) {
        throw new UnauthorizedException(errorResponse('توكن غير صالح', 401));
      }
    }
  
    private async ensureTokenNotBlacklisted(userId: number, token: string): Promise<void> {
      const isBlacklisted = await this.tokenBlackListService.isTokenBlackListed(userId, token);
      if (isBlacklisted) {
        throw new UnauthorizedException(errorResponse('تم إلغاء صلاحية التوكن', 401));
      }
    }

}
