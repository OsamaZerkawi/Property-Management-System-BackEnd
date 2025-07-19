import { Inject, Injectable } from "@nestjs/common";
import { ADVERTISEMENT_REPOSITORY, AdvertisementRepositoryInterface } from "src/domain/repositories/advertisement.repository";

@Injectable()
export class GetPendingAdvertisementUseCase {
    constructor(
        @Inject(ADVERTISEMENT_REPOSITORY)
        private readonly advertisementRepo: AdvertisementRepositoryInterface,
    ){}

    async execute(baseUrl: string){
        const ads = await this.advertisementRepo.findPendingAds();

        return ads.map((ad) => ({
            id: ad.id,
            image:  `${baseUrl}/uploads/advertisements/images/${ad.image}`,
            day_period: `${ad.day_period} ${getDayLabel(ad.day_period)}`,
            status: 'قيد المراجعة'
        }));

    }
}


function getDayLabel(n: number): string {
  if (n === 1) return 'يوم';
  if (n === 2) return 'يومان';
  if (n >= 3 && n <= 10) return 'أيام';
  return 'يوماً'; // 11+
}