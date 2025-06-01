import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-local";
import { ValidateUserUseCase } from "src/application/use-cases/auth/validate-user.use-case";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly validateUserUseCase: ValidateUserUseCase,
    ){
        super();
    }

    async validate(username : string,password : string){
        const user =  this.validateUserUseCase.execute(username,password);
        
        if(!user){
            throw new UnauthorizedException()
        }
        return user;
    }
    
}   
