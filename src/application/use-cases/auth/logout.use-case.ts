import { Inject, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthTokenBlackListService } from "src/application/services/authTokenBlacklist.service";
import { AUTH_REPOSITORY, AuthRepositoryInterface } from "src/domain/repositories/auth.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

export class LogoutUseCase {
    constructor(
            @Inject(AUTH_REPOSITORY)
            private readonly authRepo: AuthRepositoryInterface,
            private readonly tokenBlackListService: AuthTokenBlackListService,
            private readonly jwtService: JwtService,

    ){}

    async execute(userId: number,accessToken){
//Decode AccessToken toget expiration
        const payload = this.jwtService.decode(accessToken) as {exp: number};
        
        if (!payload?.exp) {
            throw new UnauthorizedException(
                errorResponse('Invalid token payload',401)
            );
        }

        const expiresIn = payload.exp - Math.floor(Date.now() / 1000);

        // Add to blacklist 
        await this.tokenBlackListService.addToBlackList(accessToken,expiresIn,userId)

        // Delete refresh token
        await this.authRepo.deleteRefreshToken(userId);
    }
}