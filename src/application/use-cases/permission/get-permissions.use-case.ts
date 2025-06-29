import { Inject } from "@nestjs/common";
import { PERMISSION_REPOSITORY, PermissionRepositoryInterface } from "src/domain/repositories/permission.repository";

export class GetPermissionsUseCase {
    constructor(
        @Inject(PERMISSION_REPOSITORY)
        private readonly permissionRepo: PermissionRepositoryInterface,
    ){}

    async execute(){
        return await this.permissionRepo.listPermissions();
    }
}