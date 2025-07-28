import { Property } from "src/domain/entities/property.entity";
import { PropertyPostTag } from "src/domain/enums/property-post-tag.enum";

export class UpdatePropertyPostDto {
    property?: Property;
    postDescription?: string;
    postImage?: string;
    postTag?: PropertyPostTag;
    postTitle?: string;
}