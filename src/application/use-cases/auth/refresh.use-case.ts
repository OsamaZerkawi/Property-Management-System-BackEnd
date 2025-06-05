import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { TokenService } from "src/application/services/token.service";
import { USER_REPOSITORY, UserRepositoryInterface } from "src/domain/repositories/user.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

@Injectable()
export class RefreshTokenUseCase {

    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepositoryInterface,
        private readonly tokenService: TokenService,
    ){}
    async execute (userId: number, refreshToken: string){
       
        //Validate token and get user
       const isValid = await this.tokenService.validateRefreshToken(userId, refreshToken);

       if(!isValid){
            throw new UnauthorizedException(
                errorResponse('رمز التحديث غير صالح',401)
            );
       }

       const user = await this.userRepo.findById(userId);

       if(!user){
           throw new NotFoundException(
            errorResponse('المستخدم غير موجود',404)
           );
       }

        // Generate tokens
        const newAccessToken = await this.tokenService.generateAccessToken(user.id,user.username);

        //Add old accessToken in blacklist
        // await this.tokenBlackListService.addToBlackList()

        return newAccessToken;
    }
}