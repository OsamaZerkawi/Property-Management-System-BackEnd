import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Image } from "src/domain/entities/image.entity";
import { ImageRepositoryInterface } from "src/domain/repositories/image.repository";
import { Repository } from "typeorm";

@Injectable()
export class ImageRepository implements ImageRepositoryInterface {
    constructor(
        @InjectRepository(Image) 
        private readonly imageRop: Repository<Image>,
    ){}

    async uploadImagesForProperty(images: any[]){
        return await this.imageRop.save(images);
    }

    async findByPropertyId(propertyId: number) {
        return await this.imageRop.find({
            where: {
                property: {id : propertyId}
            },
            relations: {
                property: {
                    office:true
                }
            }
        });
        
    }

    findById(imageId: number) {
        return this.imageRop.findOne({
            where: {
                id: imageId,
            },
            relations: {
                property: {
                    office:true
                }
            }
        });
    }

    async update(imageId: number, image_path: any) {
        return await this.imageRop.update(imageId,image_path);
    }
    
    async delete(imageId: number) {
        return await this.imageRop.delete(imageId);
    }
}