import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ADVERTISEMENT_REPOSITORY, AdvertisementRepositoryInterface } from 'src/domain/repositories/advertisement.repository';
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
 
@Injectable()
export class GetOfficeAdvertisementsUseCase {
  constructor(
        @Inject(ADVERTISEMENT_REPOSITORY)
        private readonly advertisementRepo: AdvertisementRepositoryInterface,
        @Inject(OFFICE_REPOSITORY)
        private readonly officeRepo: OfficeRepositoryInterface,
  ) {}

 
  async execute(officeId: number, baseUrl: string): Promise<string[]> {
 
    const office = await this.officeRepo.findById(officeId);
    if (!office) {
      throw new NotFoundException('المكتب غير موجود');
    }
 
    const ads = await this.advertisementRepo.getImagesApprovedAdvertisement(officeId);
    const imageUrls = ads
      .map(ad => ad.image ? `${baseUrl}/uploads/advertisements/images/${ad.image}` : null)
      .filter((u): u is string => !!u);

    return imageUrls;
  }
}
