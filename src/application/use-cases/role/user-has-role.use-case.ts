import { Inject } from "@nestjs/common";
import { waitForDebugger } from "inspector";
import { ROLE_REPOSITORY, RoleRepositoryInterface } from "src/domain/repositories/role.repository";

export class UserHasRoleUseCase { 
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepo: RoleRepositoryInterface,
    ){}

    async execute(userId: number,roleName: string){
        return await this.roleRepo.userHasRole(userId,roleName);
    }
}