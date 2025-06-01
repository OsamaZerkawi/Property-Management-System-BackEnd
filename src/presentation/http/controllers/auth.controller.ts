import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, UseGuards } from "@nestjs/common";
import { REDIRECT_METADATA } from "@nestjs/common/constants";
import { Request as requsetExpress } from "express";
import { LoginDto } from "src/application/dtos/auth/login.dto";
import { LoginUseCase } from "src/application/use-cases/auth/login.use-case";
import { LogoutUseCase } from "src/application/use-cases/auth/logout.use-case";
import { User } from "src/domain/entities/user.entity";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly logoutUseCase: LogoutUseCase,
    ){}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Request() req ,@Body() loginDto: LoginDto){
      const {user , tokens} =  await this.loginUseCase.execute(loginDto);

      const { password, ...userWithoutPassword } = user;

      const data = {
        user : userWithoutPassword,
        tokens,
      };

      return successResponse(data,'User Logged Successfully'); 
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Req() request: requsetExpress,@CurrentUser() user){
      const authHeader = request.headers.authorization;
      const accesssToken = authHeader?.split(' ')[1];

      this.logoutUseCase.execute(user.sub,accesssToken);

      return successResponse([],'Logged out successfully');

    }
}