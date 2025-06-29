import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserHasPermissionUseCase } from "src/application/use-cases/permission/user-has-permission.use-case";
import { errorResponse } from "../helpers/response.helper";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private userHasPermissionUseCase: UserHasPermissionUseCase,
    ){}

    async canActivate(context: ExecutionContext) {
        const requiredPermissions = this.reflector.get<string[]>('permissions',context.getHandler());

        if(!requiredPermissions || requiredPermissions.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const userId = user.sub;

        if(!user){
            throw new ForbiddenException(
                errorResponse('يجب تسجيل الدخول أولا',403)
            );
        }

        for(const permission of requiredPermissions){
            const hasPermission = await this.userHasPermissionUseCase.execute(userId,permission);

            if(!hasPermission){
                throw new ForbiddenException(
                    errorResponse('المستخدم لا يمتلك الصلاحية المطلوبة',403)
                );
            }
        }

        return true;
    }
    
}