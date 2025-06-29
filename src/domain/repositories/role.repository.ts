
export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';

export interface RoleRepositoryInterface {
    findById(id: number);
    createRole(name: string);
    assignRoleToUser(userId: number,roleId: number);
    removeRoleFromUser(userId: number,roleId: number);
    givePermissionToRole(roleId: number,permissionId: number);
    removePermissionFromRole(roleId: number,permissionId: number);
    userHasRole(userId: number,roleName: string);
    listRoles();
}