import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from "@nestjs/common";
import { AssignRoleToUserUseCase } from "src/application/use-cases/role/assign-role-to-user.use-cast";
import { CreateRoleUseCase } from "src/application/use-cases/role/create-role.use-case";
import { GetListRolesUseCase } from "src/application/use-cases/role/get-list-roles.use-case";
import { givePermissionToRoleUseCase } from "src/application/use-cases/role/give-permission-to-role.use-case";
import { removePermissionFromRoleUseCase } from "src/application/use-cases/role/remove-permission-from-user.use-case";
import { removeRoleFromUserUseCase } from "src/application/use-cases/role/remove-role-from-user.use-case";
import { Roles } from "src/shared/decorators/role.decorator";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('roles')
export class RoleController{
    constructor(
        private readonly createRoleUseCase: CreateRoleUseCase,
        private readonly assignRoleToUserUseCase: AssignRoleToUserUseCase,
        private readonly removeRoleFromUserUseCase: removeRoleFromUserUseCase,
        private readonly givePermissionToRoleUseCase: givePermissionToRoleUseCase,
        private readonly removePermissionFromRoleUseCase: removePermissionFromRoleUseCase,
        private readonly getListRolesUseCase: GetListRolesUseCase,
    ){}

    @Get()
    @HttpCode(HttpStatus.OK)
    async listRoles(){
        const roles = await this.getListRolesUseCase.execute();

        return successResponse(roles,'تم إرجاع جميع الرولات بنجاح',200);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createRole(
        @Body('name') name: string,
    ){
        await this.createRoleUseCase.execute(name);

        return successResponse([],'تم انشاء رول جديد بنجاح',201);
    }

    @Roles('مشرف')
    @Post(':roleId/assign-user/:userId')
    @HttpCode(HttpStatus.OK)
    async assignRoleToUser(
        @Param('userId',ParseIntPipe) userId: number,
        @Param('roleId',ParseIntPipe) roleId: number,
    ){
        await this.assignRoleToUserUseCase.execute(roleId,userId);

        return successResponse([],'تم اعطاء رول جديد للمستخدم بنجاح',200);
    }

    @Roles('مشرف')
    @Delete(':roleId/remove-user/:userId')
    @HttpCode(HttpStatus.OK)
    async removeRoleFromUser(
        @Param('userId',ParseIntPipe) userId: number,
        @Param('roleId',ParseIntPipe) roleId: number,
    ){
        await this.removeRoleFromUserUseCase.execute(userId,roleId);

        return successResponse([],'تم سحب الرول من المستخدم بنجاح',200);
    }

    @Roles('مشرف')
    @Post(':roleId/permissions/:permissionId')
    @HttpCode(HttpStatus.OK)
    async givePermissionToRole(
        @Param('roleId', ParseIntPipe) roleId: number,
        @Param('permissionId', ParseIntPipe) permissionId: number
    ){
        await this.givePermissionToRoleUseCase.execute(roleId,permissionId);

        return successResponse([],'تم اعطاء صلاحية للرول بنجاح',200);
    }

    @Roles('مشرف')
    @Delete('roleId/permissions/:permissionId')
    @HttpCode(HttpStatus.OK)
    async removePermissionFromRole(
        @Param('roleId', ParseIntPipe) roleId: number,
        @Param('permissionId', ParseIntPipe) permissionId: number
    ){
        await this.removePermissionFromRoleUseCase.execute(roleId,permissionId);

        return successResponse([],'تم سحب الصلاحية من الرول بنجاح',200);
    }
}