import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { privateDecrypt } from "crypto";
import { PropertyAccessService } from "src/application/services/propertyAccess.service";
import { Image } from "src/domain/entities/image.entity";
import { Property } from "src/domain/entities/property.entity";
import { IMAGE_REPOSITORY } from "src/domain/repositories/image.repository";
import { ImageRepository } from "src/infrastructure/repositories/image.repostiory";
import { Repository } from "typeorm";

@Injectable()
export class UploadPropertyImagesUseCase {
    constructor(
       @Inject(IMAGE_REPOSITORY)
       private readonly imageRepo: ImageRepository,
       private readonly propertyAccessService: PropertyAccessService,
    ){}

    async execute(propertyId: number ,userId: number ,files: Express.Multer.File[]){
        await this.propertyAccessService.verifyUserIsOwner(propertyId,userId);
        
        const imagePaths = files.map( (file) => ({
            image_path: file.filename,
            property: { id: propertyId },
        }));

        return this.imageRepo.uploadImagesForProperty(imagePaths);
    }
}