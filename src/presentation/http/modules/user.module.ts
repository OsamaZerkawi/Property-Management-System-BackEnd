// src/presentation/http/user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/entities/user.entity';
import {
  USER_REPOSITORY,
  UserRepositoryInterface,
} from 'src/domain/repositories/user.repository';
import { UserController } from '../controllers/user.controller';
import { GetGlobalInfoUseCase } from 'src/application/use-cases/user/get-global-info.use-case';
import { UserRepository } from 'src/infrastructure/repositories/user.property';
import { FindUserByPhoneUseCase } from 'src/application/use-cases/user/find-user-by-phone.use-case';
import { GetAllUsersUseCase } from 'src/application/use-cases/user/get-all-users.use-case';
import { AuthModule } from './auth.module';
import { GetProfileUserUseCase } from 'src/application/use-cases/user/get-profile-user.use-case';
import { UpdateUserInfoUseCase } from 'src/application/use-cases/user/update-profile-user.use-case';
import { GetUserPurchasesUseCase } from 'src/application/use-cases/user/get-user-purchases.use-case';
import { USER_PURCHASE_REPOSITORY } from 'src/domain/repositories/user-purchase.repository';
import { UserPurchaseRepository } from 'src/infrastructure/repositories/user-purchase.repository';
import { UserPropertyPurchase } from 'src/domain/entities/user-property-purchase.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User, UserPropertyPurchase])],
  controllers: [UserController],
  providers: [
    GetGlobalInfoUseCase,
    FindUserByPhoneUseCase,
    GetAllUsersUseCase,
    GetProfileUserUseCase,
    UpdateUserInfoUseCase,
    GetUserPurchasesUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: USER_PURCHASE_REPOSITORY,
      useClass: UserPurchaseRepository,
    },
  ],
  exports: [USER_PURCHASE_REPOSITORY, USER_REPOSITORY],
})
export class UserModule {}
