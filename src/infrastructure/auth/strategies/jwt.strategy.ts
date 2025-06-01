import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/domain/entities/user.entity";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){

    constructor(private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository : Repository<User>
    ) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: configService.get<string>('JWT_TOKEN_SECRET'),
        } as StrategyOptionsWithRequest);
      }
    
      async validate(payload: any) {
        return payload;
      }
}