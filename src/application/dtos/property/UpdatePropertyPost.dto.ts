import { Property } from "src/domain/entities/property.entity";

export class UpdatePropertyPostDto {
    property?: Property;
    postTitle?: string;
    postImage?: string;
}