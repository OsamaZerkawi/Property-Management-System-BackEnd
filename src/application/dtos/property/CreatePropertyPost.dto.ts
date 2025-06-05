import { Property } from "src/domain/entities/property.entity";

export class CreatePropertyPostDto {
    property: Property;
    postTitle: string;
    postImage: string;
}