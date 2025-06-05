import { Inject } from "@nestjs/common";
import { TAG_REPOSITORY, TagRepositoryInterface } from "src/domain/repositories/tag.repository";


export class FindTagsUseCase {
    constructor(
        @Inject(TAG_REPOSITORY)
        private readonly tagRepo: TagRepositoryInterface,
    ){}

    async execute(tags: number[]){
        return await this.tagRepo.findTagsByIds(tags);
    }
}