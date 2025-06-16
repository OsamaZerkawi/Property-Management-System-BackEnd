import { Inject } from "@nestjs/common";
import { ROLE_REPOSITORY, RoleRepositoryInterface } from "src/domain/repositories/role.repository";

export class CreateRoleUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepo: RoleRepositoryInterface,
    ){}

    async execute(name: string){
        return await this.roleRepo.createRole(name);
    }
}