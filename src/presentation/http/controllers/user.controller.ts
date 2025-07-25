import { Controller, Get, HttpCode, HttpStatus, Param, Query, Req, UseGuards } from "@nestjs/common";
import { FindUserByPhoneUseCase } from "src/application/use-cases/user/find-user-by-phone.use-case";
import { GetAllUsersUseCase } from "src/application/use-cases/user/get-all-users.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Public } from "src/shared/decorators/public.decorator";
import { Roles } from "src/shared/decorators/role.decorator";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { errorResponse, successResponse } from "src/shared/helpers/response.helper";
import { Request } from 'express';
import { GetGlobalInfoUseCase } from "src/application/use-cases/user/get-global-info.use-case";
@Controller('user')
export class UserController {
    constructor(
        private readonly findUserByPhoneUseCase: FindUserByPhoneUseCase,
        private readonly getAllUsersUseCase: GetAllUsersUseCase,
        private readonly getGlobalInfoUseCase: GetGlobalInfoUseCase,
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(
    @CurrentUser() user: { sub: number },
    @Req() request: Request,
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    try {
      const profile = await this.getGlobalInfoUseCase.execute(user.sub, baseUrl);
      return successResponse(profile,'تم جلب معلومات المستخدم');
    } catch (err) {
      return errorResponse(err.message, err.getStatus?.() || 500);
    }
  }
}