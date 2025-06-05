import { InjectRepository } from "@nestjs/typeorm";
import { CreatePropertyPostDto } from "src/application/dtos/property/CreatePropertyPost.dto";
import { PropertyPostTag } from "src/domain/entities/property-post-tag.entity";
import { PropertyPost } from "src/domain/entities/property-posts.entitiy";
import { Tag } from "src/domain/entities/tag.entity";
import { PropertyPostRepositoryInterface } from "src/domain/repositories/property-post.repository";
import { Repository } from "typeorm";

export class PropertyPostRepository implements PropertyPostRepositoryInterface {
    constructor(
        @InjectRepository(PropertyPost)
        private readonly propertyPostRepo: Repository<PropertyPost>,
        @InjectRepository(PropertyPostTag)
        private readonly propertyPostTagRepo: Repository<PropertyPostTag>
    ){}
    async createPropertyPostAndSaveIt(data: CreatePropertyPostDto) {
        const propertyPost = await this.propertyPostRepo.create({
            property:data.property,
            title: data.postTitle,
            image: data.postImage,
            date: new Date(),
        });

        await this.propertyPostRepo.save(propertyPost);

        return propertyPost;
    }

    async attachTagsToPost(post: PropertyPost, tags: Tag[]) {
        const postTags = tags.map(tag => 
            this.propertyPostTagRepo.create({
                propertyPost:post ,tag
            })
        );

        await this.propertyPostTagRepo.save(postTags);
    }
}