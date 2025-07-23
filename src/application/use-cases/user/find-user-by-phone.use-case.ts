import { Inject } from "@nestjs/common";
import { USER_REPOSITORY, UserRepositoryInterface } from "src/domain/repositories/user.repository";
export class FindUserByPhoneUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepositoryInterface,
    ){}

    async execute(phone: string){
        return await this.userRepo.findByPhone(phone);
    }
}