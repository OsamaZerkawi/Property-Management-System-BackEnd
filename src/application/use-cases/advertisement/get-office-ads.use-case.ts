import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ADVERTISEMENT_REPOSITORY, AdvertisementRepositoryInterface } from 'src/domain/repositories/advertisement.repository';
  
@Injectable()
export class GetAdvertisementsUseCase {
  constructor(
        @Inject(ADVERTISEMENT_REPOSITORY)
        private readonly advertisementRepo: AdvertisementRepositoryInterface, 
  ) {}

 
  async execute( baseUrl: string): Promise<string[]> {
 
    const ads = await this.advertisementRepo.getImagesApprovedAdvertisement();
    const imageUrls = ads
      .map(ad => ad.image ? `${baseUrl}/uploads/advertisements/images/${ad.image}` : null)
      .filter((u): u is string => !!u);

    return imageUrls;
  }
}
