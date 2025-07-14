import { Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Permission } from "src/domain/entities/permissions.entity";
import { PERMISSION_REPOSITORY } from "src/domain/repositories/permission.repository";
import { PermissionRepository } from "src/infrastructure/repositories/permission.repository";
import { createPermissionUseCase } from "src/application/use-cases/permission/create-permission.use-case";
import { PermissionController } from "../controllers/permission.controller";
import { GetPermissionsUseCase } from "src/application/use-cases/permission/get-permissions.use-case";
import { RolePermission } from "src/domain/entities/role-permissions.entity";
import { UserHasPermissionUseCase } from "src/application/use-cases/permission/user-has-permission.use-case";
import { UserRole } from "src/domain/entities/user-role.entity";
import { UserPermission } from "src/domain/entities/user-permission.entity";

@Module({
    imports:[
        AuthModule,
        TypeOrmModule.forFeature([Permission,RolePermission,UserRole,UserPermission])
    ],
    controllers:[PermissionController],
    providers:[
        createPermissionUseCase,
        GetPermissionsUseCase,
        UserHasPermissionUseCase,
        {
            provide: PERMISSION_REPOSITORY,
            useClass: PermissionRepository
        }
    ],
    exports:[
        PERMISSION_REPOSITORY,
        UserHasPermissionUseCase,
    ]
})
export class PermissionModule {}