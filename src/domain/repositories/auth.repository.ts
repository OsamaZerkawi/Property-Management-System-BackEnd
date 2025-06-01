import { FindOptionsWhere } from "typeorm";
import { User } from "../entities/user.entity";

type UserFindOptions = {
    where: FindOptionsWhere<User>;
    select?: Array<keyof User>;
    relations?: string[];
}

export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';

export interface AuthRepositoryInterface {
    updateRefreshToken(userId: number,expiresInDays: number,hashedRefreshToken: string);
    deleteRefreshToken(userId: number);
    updateOrInsertTokenInBlackList(userId: number,expiresAt: Date, hashedToken: string);
    getUserWithRefreshToken(userId: number);
    findUser(options : UserFindOptions);
    getBlackedTokensForUser(userId: number);
}