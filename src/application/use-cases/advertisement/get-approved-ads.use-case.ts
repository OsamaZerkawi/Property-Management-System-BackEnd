import { Inject, Injectable } from '@nestjs/common';
import { ServiceType } from 'src/domain/enums/service-type.enum';
import {
  ADVERTISEMENT_REPOSITORY,
  AdvertisementRepositoryInterface,
} from 'src/domain/repositories/advertisement.repository';
import {
  PROMOTED_PROPERTY_REPOISTORY,
  PromotedPropertyRepositoryInterface,
} from 'src/domain/repositories/promoted-property.repository';

@Injectable()
export class GetApprovedAdvertisementUseCase {
  constructor(
    @Inject(PROMOTED_PROPERTY_REPOISTORY)
    private readonly promotedPropertyRepo: PromotedPropertyRepositoryInterface,
    @Inject(ADVERTISEMENT_REPOSITORY)
    private readonly advertisementRepo: AdvertisementRepositoryInterface,
  ) {}

  async execute(baseUrl: string) {
    const [ads, promoted] = await Promise.all([
      this.advertisementRepo.getApprovedAdvertisement(),
      this.promotedPropertyRepo.getActivePromotedProperties(),
    ]);

    const adResults = ads.map((ad) => ({
      id: ad.id,
      image: `${baseUrl}/uploads/advertisements/images/${ad.image}`,
      type: ServiceType.IMAGE_AD,
      amount: ad.amount,
      office_name: ad.office_name,
      start_date: new Date(ad.start_date).toISOString().slice(0, 10),
      active_days: `${ad.day_period} أيام`,
    }));

    const promotedResults = promoted.map((item) => ({
      id: item.id,
      type: ServiceType.PROMOTIONAL_AD,
      title: item.title,
      amount: item.amount,
      office_name: item.office_name,
      start_date: new Date(item.start_date).toISOString().slice(0, 10),
      active_days: `${item.period} أيام`,
    }));

    return [...adResults , ...promotedResults];
  }
}
