import { Image } from "../entities/image.entity";

export const IMAGE_REPOSITORY = 'IMAGE_REPOSITORY';
export interface ImageRepositoryInterface {
    uploadImagesForProperty(images :any[]);
    findByPropertyId(propertyId: number);
    findById(imageId: number);
    update(imageId: number,image_path);
    delete(imageId: number);
}