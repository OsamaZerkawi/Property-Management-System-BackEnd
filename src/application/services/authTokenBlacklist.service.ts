import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { AUTH_REPOSITORY, AuthRepositoryInterface } from "src/domain/repositories/auth.repository";


@Injectable()
export class AuthTokenBlackListService {

    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepo: AuthRepositoryInterface
    ){}

    async addToBlackList(token: string , expiresIn: number , userId : number){
        const expiresAt = new Date(Date.now() + (expiresIn * 1000)); // should correct it based on access_token expires at time
        //const hashToken = await bcrypt.hash(token,10)

       await this.authRepo.updateOrInsertTokenInBlackList(userId,expiresAt,token);

       //Schedule cleanup
       //    setTimeout( () => this.cleanExpired() , expiresIn * 1000) // should correct expiresIn time unit
    }

    async isTokenBlackListed(userId: number ,token: string){
        const blackedTokens = await this.authRepo.getBlackedTokensForUser(userId);
         for (const blackedToken of blackedTokens) { 
            if (token==blackedToken.token){ return true;}
        }
        return false;
        
    }
}