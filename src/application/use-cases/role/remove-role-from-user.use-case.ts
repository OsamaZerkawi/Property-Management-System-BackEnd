import { Inject } from "@nestjs/common";
import { ROLE_REPOSITORY, RoleRepositoryInterface } from "src/domain/repositories/role.repository";

export class removeRoleFromUserUseCase{
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepo: RoleRepositoryInterface,
    ){}

    async execute(userId: number,roleId: number){
        return await this.roleRepo.removeRoleFromUser(userId,roleId);
    }
}