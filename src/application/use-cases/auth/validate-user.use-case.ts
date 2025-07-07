import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AUTH_REPOSITORY, AuthRepositoryInterface } from "src/domain/repositories/auth.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import * as bcrypt from 'bcrypt'

@Injectable()
export class ValidateUserUseCase { 
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepo: AuthRepositoryInterface
    ){}

    async execute(username: string, password: string){
        try{
            const user = await this.authRepo.findUser({
                where: {username: username}
            });
    
            if(!user){
                throw new NotFoundException(
                    errorResponse('User Not Found',404)
                );
            }
        
            const isPasswordValid = await bcrypt.compare(password,user.password);
            
            if(!isPasswordValid){
                throw new UnauthorizedException(
                    errorResponse('The provided password does not match our records',401)
                );
            }

            return user;
       }catch(error){
        throw new UnauthorizedException(
            errorResponse('Credentials are not valid',401)
        );
       }
    }
}