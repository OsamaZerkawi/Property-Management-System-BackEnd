import { Inject } from "@nestjs/common";
import { ROLE_REPOSITORY, RoleRepositoryInterface } from "src/domain/repositories/role.repository";

export class removePermissionFromRoleUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepo: RoleRepositoryInterface,
    ){}

    async execute(roleId: number,permissionId: number){
        return await this.roleRepo.removePermissionFromRole(roleId,permissionId);
    }
}