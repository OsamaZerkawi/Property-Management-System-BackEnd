import * as fs from 'fs';
import * as path from 'path';
import { Inject, NotFoundException } from '@nestjs/common';
import { IMAGE_REPOSITORY } from 'src/domain/repositories/image.repository';
import { ImageRepository } from 'src/infrastructure/repositories/image.repostiory';
import { errorResponse } from 'src/shared/helpers/response.helper';
import { PropertyAccessService } from 'src/application/services/propertyAccess.service';

export class DeletePropertyImageUseCase {
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepo: ImageRepository,
    private readonly propertyAccessService: PropertyAccessService,
  ) {}

  async execute(propertyId: number,userId: number, imageId: number) {
    await this.propertyAccessService.verifyUserIsOwner(propertyId,userId);
    
    const image = await this.imageRepo.findById(imageId);

    if (!image || image.property.id !== propertyId) {
      throw new NotFoundException(
           errorResponse('الصورة غير موجودة لهذا العقار', 404)
      );
    }

    // حذف من النظام
    const imagePath = path.join(process.cwd(), 'uploads/properties/images', image.image_path);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // حذف من قاعدة البيانات
    await this.imageRepo.delete(imageId);

    return { message: 'Image deleted successfully' };
  }
}
