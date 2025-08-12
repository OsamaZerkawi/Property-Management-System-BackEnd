import { Body, Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UploadedFile, UseGuards } from "@nestjs/common";
import { FindUserByPhoneUseCase } from "src/application/use-cases/user/find-user-by-phone.use-case";
import { GetAllUsersUseCase } from "src/application/use-cases/user/get-all-users.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Public } from "src/shared/decorators/public.decorator";
import { Roles } from "src/shared/decorators/role.decorator";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { errorResponse, successPaginatedResponse, successResponse } from "src/shared/helpers/response.helper";
import { Request } from 'express';
import { GetGlobalInfoUseCase } from "src/application/use-cases/user/get-global-info.use-case";
import { GetProfileUserUseCase } from "src/application/use-cases/user/get-profile-user.use-case";
import { UpdateUserInfoUseCase } from "src/application/use-cases/user/update-profile-user.use-case";
import { UpdateUserInfoDto } from "src/application/dtos/user/update-user-info.dto";
import { UserProfileImageInterceptor } from "src/shared/interceptors/file-upload.interceptor";
import { GetUserPurchasesUseCase } from "src/application/use-cases/user/get-user-purchases.use-case";
import { GetGlobalInfoSwaggerDoc } from "../swagger/profile/get-global-user-info.swagger";
import { MyPurchasesSwaggerDoc } from "../swagger/profile/get-user-purchases.swagger";
import { UpdateProfileSwaggerDoc } from "../swagger/profile/update-profile-user.swagger";
import { ProfileSwaggerDoc } from "../swagger/profile/get-profile-user.swagger";
import { GetAllUsersSwaggerDoc } from "../swagger/auth/get-all-users.swagger";
 @Controller('user')
export class UserController {
    constructor(
        private readonly findUserByPhoneUseCase: FindUserByPhoneUseCase,
        private readonly getAllUsersUseCase: GetAllUsersUseCase,
        private readonly getGlobalInfoUseCase: GetGlobalInfoUseCase,
        private readonly getProfileUserUseCase: GetProfileUserUseCase,
        private readonly updateUserInfoUseCase: UpdateUserInfoUseCase,
        private readonly getUserPurchases: GetUserPurchasesUseCase,
    ){}

    @Roles('مدير')
    // @Public()
    @GetAllUsersSwaggerDoc()
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
  @GetGlobalInfoSwaggerDoc()
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

  @Get('profile')
  @ProfileSwaggerDoc()
  @UseGuards(JwtAuthGuard)
  async myInformation(
    @CurrentUser() user: { sub: number },
    @Req() request: Request,
  ) {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    try {
      const profile = await this.getProfileUserUseCase.execute(user.sub, baseUrl);
      return successResponse(profile,'تم جلب معلومات المستخدم');
    } catch (err) {
      return errorResponse(err.message, err.getStatus?.() || 500);
    }
  }

  @Post('profile')
  @UpdateProfileSwaggerDoc()
  @UseGuards(JwtAuthGuard)
  @UserProfileImageInterceptor()
  async updateProfile(
    @Req() req,
    @Body() dto: UpdateUserInfoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
     if (file) {
      dto.photo = file.filename; 
    } 
    const userId = req.user.sub; 
    
    const result = await this.updateUserInfoUseCase.execute(userId, dto);
    return successResponse(result, 'تم تحديث بيانات المستخدم بنجاح');
  }

  @Get('myPurchases')
  @MyPurchasesSwaggerDoc()
  @UseGuards(JwtAuthGuard)
  async myProperties(
    @Query('page',new DefaultValuePipe(1),ParseIntPipe) page: number,
    @Query('items',new DefaultValuePipe(10),ParseIntPipe) items: number,
    @CurrentUser() user,
    @Req() request: Request
  ) {
    try {
      const baseUrl = `${request.protocol}://${request.get('host')}`;
      const {data ,total} = await this.getUserPurchases.execute(user.sub,page,items,baseUrl);
      return successPaginatedResponse(data,total,page,items, 'تم جلب الممتلكات بنجاح', 200);
    } catch (err) {
      return errorResponse(
        err.message,
        err.getStatus?.() || err.statusCode || 500,
      );
    }
  }
}