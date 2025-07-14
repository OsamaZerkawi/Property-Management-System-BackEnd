import { Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "src/domain/entities/role.entity";
import { Permission } from "src/domain/entities/permissions.entity";
import { RolePermission } from "src/domain/entities/role-permissions.entity";
import { UserRole } from "src/domain/entities/user-role.entity";
import { ROLE_REPOSITORY } from "src/domain/repositories/role.repository";
import { RoleRepository } from "src/infrastructure/repositories/role.repository";
import { PermissionModule } from "./permission.module";
import { CreateRoleUseCase } from "src/application/use-cases/role/create-role.use-case";
import { RoleController } from "../controllers/role.controller";
import { AssignRoleToUserUseCase } from "src/application/use-cases/role/assign-role-to-user.use-cast";
import { removeRoleFromUserUseCase } from "src/application/use-cases/role/remove-role-from-user.use-case";
import { givePermissionToRoleUseCase } from "src/application/use-cases/role/give-permission-to-role.use-case";
import { removePermissionFromRoleUseCase } from "src/application/use-cases/role/remove-permission-from-user.use-case";
import { GetListRolesUseCase } from "src/application/use-cases/role/get-list-roles.use-case";
import { UserHasRoleUseCase } from "src/application/use-cases/role/user-has-role.use-case";

@Module({
    imports:[
        PermissionModule,
        AuthModule,
        TypeOrmModule.forFeature([Role,Permission,RolePermission,UserRole])
    ],
    controllers:[RoleController],
    providers:[
        CreateRoleUseCase,
        AssignRoleToUserUseCase,
        removeRoleFromUserUseCase,
        givePermissionToRoleUseCase,
        removePermissionFromRoleUseCase,
        GetListRolesUseCase,
        UserHasRoleUseCase,
        {
            provide: ROLE_REPOSITORY,
            useClass: RoleRepository
        }
    ],
    exports:[ROLE_REPOSITORY,UserHasRoleUseCase],
})
export class RoleModule{}