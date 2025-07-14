import { Inject, NotFoundException } from "@nestjs/common";
import { ADVERTISEMENT_REPOSITORY, AdvertisementRepositoryInterface } from "src/domain/repositories/advertisement.repository";
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from "src/domain/repositories/office.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

export class CreateAdvertisementUseCase {
    constructor(
        @Inject(ADVERTISEMENT_REPOSITORY)
        private readonly advertisementRepo: AdvertisementRepositoryInterface,
        @Inject(OFFICE_REPOSITORY)
        private readonly officeRepo: OfficeRepositoryInterface,
    ){}


    async execute(userId: number,period: number,file: Express.Multer.File){
        const office = await this.officeRepo.findOfficeByUserId(userId);

        if(!office){
            throw new NotFoundException(
                errorResponse('لا يوجد مكتب خاص بك',404)
            );
        }

        // const amount = Number(office.advertisement_price_per_day) * period;

        // await this.advertisementRepo.createWithInvoice(office,period,file,amount);
    }
}