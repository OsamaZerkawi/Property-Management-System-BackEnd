import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { AUTH_REPOSITORY, AuthRepositoryInterface } from "src/domain/repositories/auth.repository";

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(AUTH_REPOSITORY)
        private readonly authRepo: AuthRepositoryInterface
    ){}

    async generateTokens(userId: number,username: string){
        const [accessToken , refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                username,
            },{
                secret : process.env.JWT_TOKEN_SECRET,
                expiresIn : 15 * 60,
            }),
            this.jwtService.signAsync({
                sub: userId,
                username,
            },{
                secret : process.env.JWT_REFRESH_TOKEN_SECRET,
                expiresIn : 7 * 24 * 60 * 60,
            }),
        ]);

        return {
            accessToken ,
            refreshToken
        };
    }

    async updateRefreshToken(userId : number, refreshToken: string){
        const hashedRefreshToken = await bcrypt.hash(refreshToken,10);
        const expiresInDays = parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7');
        
        await this.authRepo.updateRefreshToken(userId,expiresInDays,hashedRefreshToken);
    }
    
    async generateAccessToken(userId: number,username : string){
        const accessToken =  this.jwtService.signAsync({
            sub: userId,
            username
        },{
            secret : process.env.JWT_TOKEN_SECRET,
            expiresIn : 15 * 60,
        });

        return accessToken;
    }

    async validateRefreshToken(userId: number, incomingToken: string){

        // Get user with refresh token 
        const user = await this.authRepo.getUserWithRefreshToken(userId);

        if(!user || !user.refreshToken || new Date() > user.refreshToken.expiredAt){
            return false;
        }

        // Comparison
        return await bcrypt.compare(incomingToken,user.refreshToken.refreshToken);
    }
}