import { Property } from "src/domain/entities/property.entity";
import { PropertyPostTag } from "src/domain/enums/property-post-tag.enum";

export class CreatePropertyPostDto {
    property: Property;
    postTitle:string;
    postDescription: string;
    postImage: string;
    postTag: PropertyPostTag;
}