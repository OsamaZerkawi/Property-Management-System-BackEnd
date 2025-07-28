import { Module } from "@nestjs/common";
import { AuthController } from "../controllers/auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/domain/entities/user.entity";
import { AUTH_REPOSITORY, AuthRepositoryInterface } from "src/domain/repositories/auth.repository";
import { AuthRepository } from "src/infrastructure/repositories/auth.repository";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { jwtConfig } from "src/infrastructure/config/jwt.config";
import { TokenService } from "src/application/services/token.service";
import { AuthTokenBlackListService } from "src/application/services/authTokenBlacklist.service";
import { RefreshToken } from "src/domain/entities/refresh-token.entity";
import { TokenBlackList } from "src/domain/entities/token-blacklist.entity";
import { LocalStrategy } from "src/infrastructure/auth/strategies/local.strategy";
import { JwtStrategy } from "src/infrastructure/auth/strategies/jwt.strategy";
import { RefreshTokenStrategy } from "src/infrastructure/auth/strategies/referesh-token.strategy";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { ValidateUserUseCase } from "src/application/use-cases/auth/validate-user.use-case";
import { LoginUseCase } from "src/application/use-cases/auth/login.use-case";
import { LogoutUseCase } from "src/application/use-cases/auth/logout.use-case";
import { USER_REPOSITORY } from "src/domain/repositories/user.repository";
import { UserRepository } from "src/infrastructure/repositories/user.property";
import { RefreshTokenUseCase } from "src/application/use-cases/auth/refresh.use-case";
import { UserController } from "../controllers/user.controller";
import { FindUserByPhoneUseCase } from "src/application/use-cases/user/find-user-by-phone.use-case";
import { GetAllUsersUseCase } from "src/application/use-cases/user/get-all-users.use-case";

@Module({
    imports:[
        TypeOrmModule.forFeature([User,RefreshToken,TokenBlackList]),
        JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: jwtConfig
    }),
    ],
    controllers:[AuthController],
    providers:[
        FindUserByPhoneUseCase,
        {
           provide: AUTH_REPOSITORY,
           useClass: AuthRepository,
        },
        {
            provide:USER_REPOSITORY,
            useClass:UserRepository
        },
        LoginUseCase,
        LogoutUseCase,
        ValidateUserUseCase,
        RefreshTokenUseCase,
        GetAllUsersUseCase,
        LocalStrategy,
        JwtAuthGuard,
        JwtService,
        JwtStrategy,
        RefreshTokenStrategy,
        JwtService,
        TokenService,
        AuthTokenBlackListService,],
    exports:[JwtAuthGuard,JwtService,AuthTokenBlackListService,ValidateUserUseCase,JwtModule,USER_REPOSITORY]
})
export class AuthModule {

}