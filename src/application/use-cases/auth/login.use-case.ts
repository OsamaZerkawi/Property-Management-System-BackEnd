import { ForbiddenException, Inject } from "@nestjs/common";
import { LoginDto } from "src/application/dtos/auth/login.dto";
import { AUTH_REPOSITORY, AuthRepositoryInterface } from "src/domain/repositories/auth.repository";
import { AuthRepository } from "src/infrastructure/repositories/auth.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import * as bcrypt from 'bcrypt';
import { TokenService } from "src/application/services/token.service";

export class LoginUseCase {
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepo: AuthRepositoryInterface,
        private readonly tokenService: TokenService
    ){}

    async execute(loginDto: LoginDto){
        const user = await this.authRepo.findUser({
            where : {
                username : loginDto.username
            }
         });  

        if(!user){
            throw new ForbiddenException(
                errorResponse('Access Denied',403)
            );
        }

        const passwordMatches = await bcrypt.compare(loginDto.password,user.password);

        //if(!passwordMatches){
          //  throw new ForbiddenException(
          //      errorResponse('Access Denied',403)
        //    );
      //  }

        const tokens = await this.tokenService.generateTokens(user.id,user.username);
        await this.tokenService.updateRefreshToken(user.id,tokens.refreshToken);

        return {
            user,
            tokens
        };
    }
}