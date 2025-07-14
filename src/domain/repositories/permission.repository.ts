import { Permission } from "../entities/permissions.entity";

export const PERMISSION_REPOSITORY = 'PERMISSION_REPOSITORY';

export interface PermissionRepositoryInterface {
    findById(id: number);
    findByIds(ids: number[]);
    createPermission(name: string);
    userHasPermission(userId: number,permissionName: string);
    assignPermissionsToUser(userId: number,permissions: Permission[]);
    updateUserPermissions(userId: number,permissions: Permission[]);
    listPermissions();
}