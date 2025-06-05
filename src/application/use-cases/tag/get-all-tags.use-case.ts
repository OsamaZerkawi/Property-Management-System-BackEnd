import { Inject } from "@nestjs/common";
import { TAG_REPOSITORY, TagRepositoryInterface } from "src/domain/repositories/tag.repository";

export class GetAllTagsUseCase {
    constructor(
        @Inject(TAG_REPOSITORY)
        private readonly tagRepo: TagRepositoryInterface,
    ){}

    async execute(){
        return this.tagRepo.getAllTags();
    }
}