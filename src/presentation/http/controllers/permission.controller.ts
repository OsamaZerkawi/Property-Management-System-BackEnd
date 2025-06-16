import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { createPermissionUseCase } from "src/application/use-cases/permission/create-permission.use-case";
import { GetPermissionsUseCase } from "src/application/use-cases/permission/get-permissions.use-case";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('permissions')
export class PermissionController{
    constructor(
        private readonly createPermissionUseCase: createPermissionUseCase,
        private readonly getPermissionsUseCase: GetPermissionsUseCase,
    ){}


    @Get()
    @HttpCode(HttpStatus.OK)
    async listPermissions() {
        const permissions = await this.getPermissionsUseCase.execute();

        return successResponse(permissions,'تم ارجاع جميع الصلاحيات بنجاح',200);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPermission(
        @Body('name') name: string,
    ){
        const permission = await this.createPermissionUseCase.execute(name);

        return successResponse(permission,'تم انشاء صلاحية جديدة بنجاح',201);
    }
}