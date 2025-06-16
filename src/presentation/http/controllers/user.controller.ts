import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { FindUserByPhoneUseCase } from "src/application/use-cases/user/find-user-by-phone.use-case";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('user')
export class UserController {
    constructor(
        private readonly findUserByPhoneUseCase: FindUserByPhoneUseCase,
    ){}

    @Get()
    async getUserByPhone(
        @Query('phone') phone: string,
    ){
        const user = await this.findUserByPhoneUseCase.execute(phone);

        return successResponse(user,'تم ارجاع المستخدم بنجاح',200);
    }
}