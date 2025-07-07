import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-local";
import { ValidateUserUseCase } from "src/application/use-cases/auth/validate-user.use-case";
import { errorResponse } from "src/shared/helpers/response.helper";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,'local'){
    constructor(
        private readonly validateUserUseCase: ValidateUserUseCase,
    ){
        super();
    }

    async validate(username : string,password : string){
        const user =  await this.validateUserUseCase.execute(username,password);
        
        if(!user){
            throw new UnauthorizedException(
                errorResponse('Access Denied',401)
            );
        }
        return user;
    }
    
}   
