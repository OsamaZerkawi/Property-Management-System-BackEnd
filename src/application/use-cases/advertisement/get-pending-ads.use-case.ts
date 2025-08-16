import { Inject, Injectable } from '@nestjs/common';
import { ServiceType } from 'src/domain/enums/service-type.enum';
import {
  ADVERTISEMENT_REPOSITORY,
  AdvertisementRepositoryInterface,
} from 'src/domain/repositories/advertisement.repository';
import { ServicePriceRepository } from 'src/infrastructure/repositories/service-price.repository';

@Injectable()
export class GetPendingAdvertisementUseCase {
  constructor(
    private readonly servicePriceRepo: ServicePriceRepository,
    @Inject(ADVERTISEMENT_REPOSITORY)
    private readonly advertisementRepo: AdvertisementRepositoryInterface,
  ) {}

  async execute(baseUrl: string) {
    const ads = await this.advertisementRepo.findPendingAds();
    const price = await this.servicePriceRepo.findPriceByService(
      ServiceType.IMAGE_AD,
    );

    return ads.map((ad) => ({
      id: ad.id,
      amount: ad.day_period * price,
      type: ServiceType.IMAGE_AD,
      image: `${baseUrl}/uploads/advertisements/images/${ad.image}`,
      office_name: ad.office.name,
      day_period: `${ad.day_period} أيام`,
      created_at: ad.created_at.toISOString().split('T')[0],
    }));
  }
}

// function getDayLabel(n: number): string {
//   if (n === 1) return 'يوم';
//   if (n === 2) return 'يومان';
//   if (n >= 3 && n <= 10) return 'أيام';
//   return 'يوماً'; // 11+
// }
