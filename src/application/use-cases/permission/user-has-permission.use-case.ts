import { Inject } from "@nestjs/common";
import { PERMISSION_REPOSITORY, PermissionRepositoryInterface } from "src/domain/repositories/permission.repository";

export class UserHasPermissionUseCase {
    constructor(
        @Inject(PERMISSION_REPOSITORY)
        private readonly permissionRepo: PermissionRepositoryInterface,
    ){}

    async execute(userId: number,permissionName: string){
        return await this.permissionRepo.userHasPermission(userId,permissionName);
    }
}