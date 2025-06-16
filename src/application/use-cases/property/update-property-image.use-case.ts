import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Image } from "src/domain/entities/image.entity";
import * as fs from 'fs';
import * as path from 'path';
import { IMAGE_REPOSITORY } from "src/domain/repositories/image.repository";
import { ImageRepository } from "src/infrastructure/repositories/image.repostiory";
import { errorResponse } from "src/shared/helpers/response.helper";
import { PropertyAccessService } from "src/application/services/propertyAccess.service";

@Injectable()
export class UpdatePropertyImageUseCase {
    constructor(
        @Inject(IMAGE_REPOSITORY)
        private readonly  imageRepo: ImageRepository,
        private readonly propertyAccessService: PropertyAccessService,
    ) {}

    async execute(propertyId: number,userId: number,imageId: number,file: Express.Multer.File){
      
      await this.propertyAccessService.verifyUserIsOwner(propertyId,userId);
      
      const image = await this.imageRepo.findById(imageId);
      if (!image || image.property.id !== propertyId) {
        throw new NotFoundException(
          errorResponse('الصورة غير موجودة لهذا العقار', 404)
        );
      }
      
      
      const oldimagePath = path.join(process.cwd(), 'uploads/properties/images', image.image_path);
      
      if (fs.existsSync(oldimagePath)) {
        fs.unlinkSync(oldimagePath);
      }
  
      image.image_path = file.filename;
      await this.imageRepo.update(imageId, { image_path: file.filename });
    }
}