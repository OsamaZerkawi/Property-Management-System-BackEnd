import { Inject } from "@nestjs/common";
import { ROLE_REPOSITORY, RoleRepositoryInterface } from "src/domain/repositories/role.repository";

export class AssignRoleToUserUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepo: RoleRepositoryInterface,
    ){}

    async execute(roleId: number,userId: number){
        return await this.roleRepo.assignRoleToUser(userId,roleId);
    }
}