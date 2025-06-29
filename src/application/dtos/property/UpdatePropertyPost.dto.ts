import { Property } from "src/domain/entities/property.entity";

export class UpdatePropertyPostDto {
    property?: Property;
    postDescription?: string;
    postImage?: string;
}