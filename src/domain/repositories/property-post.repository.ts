import { CreatePropertyPostDto } from "src/application/dtos/property/CreatePropertyPost.dto";
import { PropertyPost } from "../entities/property-posts.entitiy";
import { Tag } from "../entities/tag.entity";

export const PROPERTY_POST_REPOSITORY = 'PROPERTY_POST_REPOSITORY';

export interface PropertyPostRepositoryInterface {
    createPropertyPostAndSaveIt(data: CreatePropertyPostDto);
    attachTagsToPost(post: PropertyPost,tags: Tag[]);
}