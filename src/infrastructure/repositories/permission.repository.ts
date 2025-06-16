import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "src/domain/entities/permissions.entity";
import { RolePermission } from "src/domain/entities/role-permissions";
import { PermissionRepositoryInterface } from "src/domain/repositories/permission.repository";
import { Repository } from "typeorm";

export class PermissionRepository implements PermissionRepositoryInterface {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepo: Repository<Permission>,
        @InjectRepository(RolePermission)
        private readonly rolePermissionRepo: Repository<RolePermission>,
        
    ){}

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