import { CreatePropertyPostDto } from "src/application/dtos/property/CreatePropertyPost.dto";
import { PropertyPost } from "../entities/property-posts.entitiy";
// import { Tag } from "../entities/tag.entity";
import { UpdatePropertyDto } from "src/application/dtos/property/UpdateProperty.dto";
import { UpdatePropertyPostDto } from "src/application/dtos/property/UpdatePropertyPost.dto";

export const PROPERTY_POST_REPOSITORY = 'PROPERTY_POST_REPOSITORY';

export interface PropertyPostRepositoryInterface {
    createPropertyPostAndSaveIt(data: CreatePropertyPostDto);
    updatePropertyPost(id: number,data: UpdatePropertyPostDto);
}