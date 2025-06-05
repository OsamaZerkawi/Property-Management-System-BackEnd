import { Inject } from "@nestjs/common";
import { PropertyPost } from "src/domain/entities/property-posts.entitiy";
import { Tag } from "src/domain/entities/tag.entity";
import { PROPERTY_POST_REPOSITORY, PropertyPostRepositoryInterface } from "src/domain/repositories/property-post.repository";

export class AttachTagsToPostUseCase {
    constructor(
        @Inject(PROPERTY_POST_REPOSITORY)
        private readonly propertyPostRepo: PropertyPostRepositoryInterface,
    ){}

    async execute (post: PropertyPost,tags:Tag[]){
        return await this.propertyPostRepo.attachTagsToPost(post,tags);
    }
}