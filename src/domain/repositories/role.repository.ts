import { Role } from "../entities/role.entity";
import { User } from "../entities/user.entity";

export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';

export interface RoleRepositoryInterface {
    findByName(name: string);
    findById(id: number);
    createRole(name: string);
    assignRole(user: User,role: Role);
    assignRoleToUser(userId: number,roleId: number);
    removeRoleFromUser(userId: number,roleId: number);
    givePermissionToRole(roleId: number,permissionId: number);
    removePermissionFromRole(roleId: number,permissionId: number);
    userHasRole(userId: number,roleName: string);
    listRoles();
}