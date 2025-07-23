import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from "@nestjs/common";
import { FindUserByPhoneUseCase } from "src/application/use-cases/user/find-user-by-phone.use-case";
import { GetAllUsersUseCase } from "src/application/use-cases/user/get-all-users.use-case";
import { Public } from "src/shared/decorators/public.decorator";
import { Roles } from "src/shared/decorators/role.decorator";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { errorResponse, successResponse } from "src/shared/helpers/response.helper";

@Controller('user')
export class UserController {
    constructor(
        private readonly findUserByPhoneUseCase: FindUserByPhoneUseCase,
        private readonly getAllUsersUseCase: GetAllUsersUseCase,
    ){}

    // @Roles('مدير')
    @Public()
    @Get('/details')
    @HttpCode(HttpStatus.OK)
    async getUsers(){
        const users = await this.getAllUsersUseCase.execute();

        return successResponse(users,'تم إرجاع جميع حسابات المستخدمين بنجاح',200);
    }
    
    @Get()
    async getUserByPhone(
        @Query('phone') phone: string,
    ){
        const user = await this.findUserByPhoneUseCase.execute(phone);
        if(!user){
            return errorResponse('المستخدم غير موجود',404);
        }
        return successResponse(user,'تم ارجاع المستخدم بنجاح',200);
    }
}