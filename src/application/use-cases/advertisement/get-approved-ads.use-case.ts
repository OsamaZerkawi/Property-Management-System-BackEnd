import { Inject, Injectable } from "@nestjs/common";
import { ADVERTISEMENT_REPOSITORY, AdvertisementRepositoryInterface } from "src/domain/repositories/advertisement.repository";

@Injectable()
export class GetApprovedAdvertisementUseCase {
    constructor(
        @Inject(ADVERTISEMENT_REPOSITORY)   
        private readonly advertisementRepo: AdvertisementRepositoryInterface,
    ){}

    async execute(baseUrl: string){
       const ads = await this.advertisementRepo.getApprovedAdvertisement(); 

       return ads.map(ad => ({
         id: ad.id,
         image: `${baseUrl}/uploads/advertisements/images/${ad.image}`,
         is_active: ad.is_active,
         start_date: ad.start_date?.toISOString().slice(0, 10),
         active_days: ad.day_period,
       }));
    }
}