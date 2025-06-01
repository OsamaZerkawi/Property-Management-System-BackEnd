import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "src/domain/entities/refresh-token.entity";
import { TokenBlackList } from "src/domain/entities/token-blacklist.entity";
import { User } from "src/domain/entities/user.entity";
import { AuthRepositoryInterface } from "src/domain/repositories/auth.repository";
import { FindOptionsWhere, MoreThan, Repository } from "typeorm";

@Injectable()
export class AuthRepository implements AuthRepositoryInterface{
    constructor ( 
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>,
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>,
        @InjectRepository(TokenBlackList)
        private readonly tokenBlackListRepository: Repository<TokenBlackList>,
    ) {}

    async updateRefreshToken(userId: number, expiresInDays: number, hashedRefreshToken: string) {
        await this.refreshTokenRepository
                .createQueryBuilder()
                .insert()
                .into(RefreshToken)
                .values({
                    refreshToken: hashedRefreshToken,
                    expiredAt: () => `NOW() + INTERVAL '${expiresInDays} days'`,
                    user :{ id: userId}
        
                })
                .orUpdate(['refreshToken','expiredAt'],['user_id'])
                .execute()
    }

    async deleteRefreshToken(userId: number) {
       await this.refreshTokenRepository
        .createQueryBuilder()
        .delete()
        .where('user_id = :userId',{userId})
        .execute();
    }
    async updateOrInsertTokenInBlackList(userId: number, expiresAt: Date, hashedToken: string) {
        await this.tokenBlackListRepository.upsert({
                   token : hashedToken ,
                   expiresAt,
                   userId
               },
               ['token']
        );
    }
    async getUserWithRefreshToken(userId: number) {
        return await this.userRepository.findOne({
            where : {id : userId},
            relations : ['refreshToken'],
        });
    }
    async findUser(options: { where: FindOptionsWhere<User>; select?: Array<keyof User>; relations?: string[]; }) {
        return this.userRepository.findOne({
            where: options.where,
            select: options.select,
            relations: options.relations
        });
    }
    async getBlackedTokensForUser(userId: number) {
        return await this.tokenBlackListRepository.find({
            where : {
                userId,
                expiresAt: MoreThan(new Date()) // Only check non-expired tokens
            }
        });
    }
    
}