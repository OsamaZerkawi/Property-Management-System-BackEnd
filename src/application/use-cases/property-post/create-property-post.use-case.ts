import { Inject } from "@nestjs/common";
import { CreatePropertyPostDto } from "src/application/dtos/property/CreatePropertyPost.dto";
import { PROPERTY_POST_REPOSITORY, PropertyPostRepositoryInterface } from "src/domain/repositories/property-post.repository";

export class CreatePropertyPostUseCase {
    constructor(
        @Inject(PROPERTY_POST_REPOSITORY)
        private readonly propertyPostRepo: PropertyPostRepositoryInterface,
    ){}

    async execute(data :CreatePropertyPostDto){
        const propertyPost = await this.propertyPostRepo.createPropertyPostAndSaveIt(data);

        return propertyPost;
    }
}