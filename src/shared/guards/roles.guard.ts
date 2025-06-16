import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserHasRoleUseCase } from "src/application/use-cases/role/user-has-role.use-case";
import { errorResponse } from "../helpers/response.helper";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(
        private reflector: Reflector,
        private readonly userHasRoleUseCase: UserHasRoleUseCase,
    ){}
    async canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.get<string[]>('roles',context.getHandler());

        if(!requiredRoles || requiredRoles.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        console.log(request);
        const user = request.user;
        console.log(user);

        const userId = user.sub;

        if(!user){
            throw new ForbiddenException(
                errorResponse('يجب تسجيل الدخول أولا',403)
            );
        }

        for(const role of requiredRoles) {
            const hasRole = await this.userHasRoleUseCase.execute(userId,role);
            if(!hasRole){
                throw new ForbiddenException(
                    errorResponse('المستخدم لا يمتلك الدور المطلوب',403)
                );
            }
        }

        return true;
    }
    
}