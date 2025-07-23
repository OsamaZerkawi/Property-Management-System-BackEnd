import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { database } from "firebase-admin";
import { userInfo } from "os";
import { CreateAdminDto } from "src/application/dtos/auth/create-admin.dto";
import { UpdateAdminDto } from "src/application/dtos/auth/update-admin.dto";
import { CreateAdminUseCase } from "src/application/use-cases/user/create-admin.use-case";
import { DeleteUserUseCase } from "src/application/use-cases/user/delete-user.use-case";
import { GetAllUsersUseCase } from "src/application/use-cases/user/get-all-users.use-case";
import { GetSupervisorsUseCase } from "src/application/use-cases/user/get-supervisors.use-case";
import { UpdateAdminUseCase } from "src/application/use-cases/user/update-admin.use-case";
import { Role } from "src/domain/entities/role.entity";
import { Public } from "src/shared/decorators/public.decorator";
import { Roles } from "src/shared/decorators/role.decorator";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('admin')
export class AdminController {
    constructor(
        private readonly createAdminUseCase: CreateAdminUseCase,
        private readonly getSupervisorsUseCase: GetSupervisorsUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
        private readonly updateAdminUseCase: UpdateAdminUseCase,
    ){}

    @Roles('مدير')
    // @Public()
    @Get()
    @HttpCode(HttpStatus.OK)
    async getSupervisors(){
        const supervisors = await this.getSupervisorsUseCase.execute();

        return successResponse(supervisors,'تم ارجاع جميع المشرفين',200);
    }

    @Roles('مدير')
    // @Public()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() data: CreateAdminDto
    ){
        await this.createAdminUseCase.execute(data);

        return successResponse([],'تم انشاء حساب للمشرف بنجاح',201);
    }

    @Roles('مدير')
    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async deleteSupervisor(
        @Param('id',ParseIntPipe) id: number,
    ){
        await this.deleteUserUseCase.execute(id);

        return successResponse([],'تم حذف المشرف بنجاح',200);
    }

    @Roles('مدير')
    // @Public()
    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    async updateAdmin(
        @Param('id',ParseIntPipe) id: number,
        @Body() data: UpdateAdminDto,
    ){
        await this.updateAdminUseCase.execute(id,data);

        return successResponse([],'تم تحديث بيانات المشرف بنجاح',200);
    }
}