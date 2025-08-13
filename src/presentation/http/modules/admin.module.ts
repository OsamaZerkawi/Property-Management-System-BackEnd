import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/entities/user.entity';
import { AuthModule } from './auth.module';
import { UserRole } from 'src/domain/entities/user-role.entity';
import { Role } from 'src/domain/entities/role.entity';
import { MailService } from 'src/application/services/mail.service';
import { AdminController } from '../controllers/admin.controller';
import { CreateUserUseCase } from 'src/application/use-cases/moblie_auth/create-user.usecase';
import { RoleModule } from './role.module';
import { CreateAdminUseCase } from 'src/application/use-cases/user/create-admin.use-case';
import { Permission } from 'src/domain/entities/permissions.entity';
import { UserPermission } from 'src/domain/entities/user-permission.entity';
import { PermissionModule } from './permission.module';
import { GetSupervisorsUseCase } from 'src/application/use-cases/user/get-supervisors.use-case';
import { DeleteUserUseCase } from 'src/application/use-cases/user/delete-user.use-case';
import { UpdateAdminUseCase } from 'src/application/use-cases/user/update-admin.use-case';
import { ADMIN_CITY_REPOSITORY } from 'src/domain/repositories/admin-city.repository';
import { AdminCityRepository } from 'src/infrastructure/repositories/admin-city.repository';
import { AdminCity } from 'src/domain/entities/admin-city.entity';

@Module({
  imports: [
    PermissionModule,
    AuthModule,
    RoleModule,
    TypeOrmModule.forFeature([
      User,
      UserRole,
      Role,
      Permission,
      UserPermission,
      AdminCity,
    ]),
  ],
  controllers: [AdminController],
  providers: [
    MailService,
    DeleteUserUseCase,
    CreateAdminUseCase,
    UpdateAdminUseCase,
    GetSupervisorsUseCase,
    {
      provide: ADMIN_CITY_REPOSITORY,
      useClass: AdminCityRepository,
    },
  ],
  exports: [],
})
export class AdminModule {}
