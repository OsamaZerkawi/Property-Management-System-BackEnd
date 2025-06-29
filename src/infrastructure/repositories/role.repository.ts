import { Inject, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolePermission } from "src/domain/entities/role-permissions";
import { Role } from "src/domain/entities/role.entity";
import { UserRole } from "src/domain/entities/user-role.entity";
import { PERMISSION_REPOSITORY, PermissionRepositoryInterface } from "src/domain/repositories/permission.repository";
import { RoleRepositoryInterface } from "src/domain/repositories/role.repository";
import { USER_REPOSITORY, UserRepositoryInterface } from "src/domain/repositories/user.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { Not, Repository } from "typeorm";

export class RoleRepository implements RoleRepositoryInterface {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepositoryInterface,
        @Inject(PERMISSION_REPOSITORY)  
        private readonly permissionRepo: PermissionRepositoryInterface,
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,
        @InjectRepository(UserRole)
        private readonly userRoleRepo: Repository<UserRole>,
        @InjectRepository(RolePermission)
        private readonly rolePermissionRepo: Repository<RolePermission>,
    ){}

    async findById(id: number) {
        return await this.roleRepo.findOne({
            where: {id}
        });
    }

    async createRole(name: string) {
        const role = this.roleRepo.create({name});
        return await this.roleRepo.save(role);
    }

    async assignRoleToUser(userId: number, roleId: number) {
        const user = await this.userRepo.findById(userId);

        if(!user){
            throw new NotFoundException(
                errorResponse('لا يوجد حساب مستخدم لهذا المعرف',404)
            );
        }

        const role = await this.findById(roleId);

        if(!role){
            throw new NotFoundException(
                errorResponse('لا يوجد رول لهذا المعرف',404)    
            );
        }

        const userRole = this.userRoleRepo.create({role,user});

        return await this.userRoleRepo.save(userRole);
    }

    async removeRoleFromUser(userId: number, roleId: number) {
        await this.userRoleRepo.delete({ user: {id: userId}, role: {id: roleId}});
    }

    async givePermissionToRole(roleId: number, permissionId: number) {
        const role = await this.findById(roleId);

        if(!role){
            throw new NotFoundException(
                errorResponse('لا يوجد رول لهذا المعرف',404)
            );
        }

        const permission = await this.permissionRepo.findById(permissionId);

        if(!permission) {
            throw new NotFoundException(
                errorResponse('لا يوجد صلاحية لهذا المعرف',404)
            );
        }

        const rolePermission = this.rolePermissionRepo.create({ role, permission});

        return await this.rolePermissionRepo.save(rolePermission);
    }

    async removePermissionFromRole(roleId: number, permissionId: number) {
       await this.rolePermissionRepo.delete({ role: { id: roleId }, permission: { id: permissionId } });
    }

    async userHasRole(userId: number, roleName: string) {
        const count = await this.userRoleRepo.count({
            where: {
                user: {id: userId},
                role: {name: roleName}
            },
        });

        return count > 0;
    }

    async listRoles() {
        return await this.roleRepo.find({
            select:['id','name']
        });
    }
}