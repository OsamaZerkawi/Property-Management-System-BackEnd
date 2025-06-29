
export const PERMISSION_REPOSITORY = 'PERMISSION_REPOSITORY';

export interface PermissionRepositoryInterface {
    findById(id: number);
    createPermission(name: string);
    userHasPermission(userId: number,permissionName: string);
    listPermissions();
}