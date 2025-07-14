import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "src/domain/entities/permissions.entity";
import { RolePermission } from "src/domain/entities/role-permissions.entity";
import { UserPermission } from "src/domain/entities/user-permission.entity";
import { PermissionRepositoryInterface } from "src/domain/repositories/permission.repository";
import { In, Repository } from "typeorm";

export class PermissionRepository implements PermissionRepositoryInterface {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepo: Repository<Permission>,
        @InjectRepository(UserPermission)
        private readonly userPermissionRepo: Repository<UserPermission>,
        @InjectRepository(RolePermission)
        private readonly rolePermissionRepo: Repository<RolePermission>,
        
    ){}

    async updateUserPermissions(userId: number, permissions: Permission[]) {
        await this.userPermissionRepo.delete({ user: { id: userId } });

        const userPermissions = permissions.map(permission => ({
          user: { id: userId },
          permission: { id: permission.id },
        }));

        await this.userPermissionRepo.save(userPermissions);
    }

    async assignPermissionsToUser(userId: number, permissions: Permission[]) {
        const userPermissions = permissions.map( (permission) =>
            this.userPermissionRepo.create({
                user: {id: userId},
                permission
            })
        );

        await this.userPermissionRepo.save(userPermissions);
    }

    findByIds(ids: number[]) {
        return this.permissionRepo.findBy({
            id: In(ids)
        });
    }

    async createPermission(name: string) {
        const permission = this.permissionRepo.create({name});
        
        return await this.permissionRepo.save(permission);
    }

    async listPermissions() {
        return await this.permissionRepo.find({
            select:['id','name']
        });
    }

    async findById(id: number) {
        return await this.permissionRepo.findOne({
            where:{id}
        });
    }

    async userHasPermission(userId: number, permissionName: string) {
        const count = await this.rolePermissionRepo
        .createQueryBuilder('role_permission')
        .leftJoin('role_permission.role','role')
        .leftJoin('role.userRoles','user_role')
        .leftJoin('role_permission.permission','permission')
        .where('user_role.userId = :userId',{userId})
        .andWhere('permission.name = :permissionName',{permissionName})
        .getCount();

        return count > 0;

    }
}