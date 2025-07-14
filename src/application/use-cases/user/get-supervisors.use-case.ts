import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ROLE_REPOSITORY, RoleRepositoryInterface } from "src/domain/repositories/role.repository";
import { USER_REPOSITORY, UserRepositoryInterface } from "src/domain/repositories/user.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

@Injectable()
export class GetSupervisorsUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepositoryInterface,
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepo: RoleRepositoryInterface,
    ){}

    async execute() {
        const role = await this.roleRepo.findByName('مشرف');
        if(!role){
            throw new NotFoundException(
                errorResponse('الدور مشرف غير موجود',404)
            );
        }

        const users = await this.userRepo.findUsersByRoleId(role.id);

        return users.map(user => ({
          id: user.id,
          fullName: `${user.first_name} ${user.last_name}`,
          username: user.username,
          permissions: user.userPermissions?.map(up => up.permission.name) || [],
          joiningDate: user.created_at,
        }));
    }
}