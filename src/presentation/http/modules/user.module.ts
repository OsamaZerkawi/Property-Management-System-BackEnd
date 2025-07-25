// src/presentation/http/user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/entities/user.entity'; 
 import { USER_REPOSITORY, UserRepositoryInterface } from 'src/domain/repositories/user.repository';
 import { UserController } from '../controllers/user.controller';
import { GetGlobalInfoUseCase } from 'src/application/use-cases/user/get-global-info.use-case';
import { UserRepository } from 'src/infrastructure/repositories/user.property';
import { FindUserByPhoneUseCase } from 'src/application/use-cases/user/find-user-by-phone.use-case';
import { GetAllUsersUseCase } from 'src/application/use-cases/user/get-all-users.use-case';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    GetGlobalInfoUseCase,
    FindUserByPhoneUseCase,
    GetAllUsersUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
