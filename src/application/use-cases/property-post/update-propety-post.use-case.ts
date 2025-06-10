import { Inject } from "@nestjs/common";
import { UpdatePropertyPostDto } from "src/application/dtos/property/UpdatePropertyPost.dto";
import { PROPERTY_POST_REPOSITORY, PropertyPostRepositoryInterface } from "src/domain/repositories/property-post.repository";

export class UpdatePropertyPostUseCase {
    constructor(
        @Inject(PROPERTY_POST_REPOSITORY)
        private readonly propertyPostRepo: PropertyPostRepositoryInterface
    ) {}

    async execute(propertyPostId: number,data: UpdatePropertyPostDto){
        return await this.propertyPostRepo.updatePropertyPost(propertyPostId,data);
    }
}