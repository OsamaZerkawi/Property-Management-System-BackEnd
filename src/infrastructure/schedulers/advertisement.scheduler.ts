import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ADVERTISEMENT_REPOSITORY, AdvertisementRepositoryInterface } from "src/domain/repositories/advertisement.repository";

@Injectable()
export class AdvertisementScheduler {

    private readonly logger = new Logger(AdvertisementScheduler.name);
    constructor(
        @Inject(ADVERTISEMENT_REPOSITORY)
        private readonly advertisementRepo: AdvertisementRepositoryInterface,
    ){}

    // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    // async deactivateExpireAds(){
    //   const today = new Date();
    //   today.setHours(0,0,0);  
      
    //   const result = await this.advertisementRepo.deactivateExpiredAdvertisements(today);
      
    //   this.logger.log(`✅ Deactivated ${result} expired advertisements.`);
    // }
}