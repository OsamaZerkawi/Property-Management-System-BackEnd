import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthTokenBlackListService } from "src/application/services/authTokenBlacklist.service"; 
import { JwtService } from "@nestjs/jwt";
// import { RoleService } from "../services/role.service";
import { Reflector } from "@nestjs/core";
// import { RoleResolver, ROLES_KEY } from "src/shared/decorators/roles.decorator";
import { errorResponse } from "../helpers/response.helper";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
    constructor(
        private tokenBlackListService : AuthTokenBlackListService,
        private jwtService : JwtService,
        // private readonly roleService: RoleService
    ){
        super();
    }

    // private async getRequiredRoles(context : ExecutionContext){
    //     const reflector = new Reflector();
    //     const rolesMeta =  reflector.get<string | string[] | RoleResolver>(ROLES_KEY, context.getHandler());

    //     if(!rolesMeta){
    //         return [];
    //     }

    //     const request = context.switchToHttp().getRequest();

    //     if (typeof rolesMeta === 'function') {
    //         const resolvedRoles = await rolesMeta(request);
    //         return Array.isArray(resolvedRoles) ? resolvedRoles : [resolvedRoles];
    //     }

    //     return Array.isArray(rolesMeta)  ? rolesMeta : [rolesMeta];
    // }

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

    async canActivate(context: ExecutionContext):  Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractToken(request);
        const payload = this.jwtService.verify(token,{
            secret: process.env.JWT_TOKEN_SECRET,
            ignoreExpiration: true
        });

        const  userId = payload.sub;
        
        if(await this.tokenBlackListService.isTokenBlackListed(userId,token)){
            throw new UnauthorizedException(
                errorResponse('تم إلغاء صلاحية التوكن',401)
            )
        }

        return super.canActivate(context) as Promise<boolean>;

        // const requiredRoles = await this.getRequiredRoles(context);

        // if (requiredRoles.length > 0) {
        //     const userId = payload.sub;
        //     const hasRole = await Promise.any(
        //         requiredRoles.map(role => this.roleService.userHasRole(userId, role))
        //     );
            
        //     if (!hasRole) {
        //         throw new ForbiddenException(
        //             errorResponse(`You don't have permission to access this resource.`, 403)
        //         );
        //     }
        // }

        // return super.canActivate(context) as Promise<boolean>;
    }

}
