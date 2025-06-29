import { Inject } from "@nestjs/common";
import { PERMISSION_REPOSITORY, PermissionRepositoryInterface } from "src/domain/repositories/permission.repository";

export class createPermissionUseCase {
    constructor(
        @Inject(PERMISSION_REPOSITORY)  
        private readonly permissionRepo: PermissionRepositoryInterface,
    ){}

    async execute(name: string){
        return await this.permissionRepo.createPermission(name);
    }
}