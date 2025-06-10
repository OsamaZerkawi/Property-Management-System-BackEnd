import { InjectRepository } from "@nestjs/typeorm";
import { UserPost } from "src/domain/entities/user-post.entity";
import { UserPostRepositoryInterface } from "src/domain/repositories/user-post.repository";
import { Repository } from "typeorm";

export class UserPostRepository implements UserPostRepositoryInterface {
    constructor(
        @InjectRepository(UserPost)
        private readonly userPostRepo: Repository<UserPost>,
    ) {}

    async getAll() {
    }
}