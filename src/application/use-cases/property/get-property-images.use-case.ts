import { Inject, Injectable } from '@nestjs/common';
import { IMAGE_REPOSITORY } from 'src/domain/repositories/image.repository';
import { ImageRepository } from 'src/infrastructure/repositories/image.repostiory';

@Injectable()
export class GetPropertyImagesUseCase {
  constructor(
         @Inject(IMAGE_REPOSITORY)
         private readonly imageRepo: ImageRepository
  ){}

  async execute(propertyId: number,baseUrl: string) {
    const images = await this.imageRepo.findByPropertyId(propertyId);

    return images.map((image) => ({
      id: image.id,
      image_url: `${baseUrl}/uploads/${image.image_path}`,
    }));
  }
}
