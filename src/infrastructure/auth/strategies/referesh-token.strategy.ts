import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy,'jwt-refresh'){
    constructor( configService : ConfigService){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback : true,
        } as StrategyOptionsWithRequest);
    }

   validate(req : Request,payload : any){
    const refreshToken = req.get('authorization')?.replace('Bearer','').trim();
    if(!refreshToken){
        throw new UnauthorizedException('رمز التحديث الذي تم إرساله غير صحيح أو منتهي الصلاحية');
    }
    return {
        ...payload,
        refreshToken,
    }
   }
}

