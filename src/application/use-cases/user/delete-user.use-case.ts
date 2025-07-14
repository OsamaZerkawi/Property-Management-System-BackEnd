import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY, UserRepositoryInterface } from "src/domain/repositories/user.repository";

@Injectable()
export class DeleteUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepositoryInterface,
    ){}

    async execute(userId: number){
        await this.userRepo.deleteUserById(userId);
    }
}