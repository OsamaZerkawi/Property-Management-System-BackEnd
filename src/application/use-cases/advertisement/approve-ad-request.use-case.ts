import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AdminAgreement } from "src/domain/enums/admin-agreement.enum";
import { ADVERTISEMENT_REPOSITORY, AdvertisementRepositoryInterface } from "src/domain/repositories/advertisement.repository";
import { NOTIFICATION_REPOSITORY, NotificationRepositoryInterface } from "src/domain/repositories/notification.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

@Injectable()
export class ApproveAdRequestUseCase {
    constructor(
        @Inject(ADVERTISEMENT_REPOSITORY)
        private readonly advertisementRepo: AdvertisementRepositoryInterface,
        @Inject(NOTIFICATION_REPOSITORY)
        private readonly notificationRepo: NotificationRepositoryInterface,
    ){}

    async execute(adId: number) {
        const advertisement = await this.advertisementRepo.findById(adId);
        if(!advertisement){
            throw new NotFoundException(
                errorResponse('الإعلان غير موجود',404)
            );
        }

        await this.advertisementRepo.update(adId,{
            admin_agreement: AdminAgreement.APPROVED,
        });

        const user = advertisement.office.user;

        await this.notificationRepo.create({
            userId: user.id,
            title: 'تمت الموافقة على إعلانك',
            body:'يمكنك الآن إتمام عملة الدفع لتغيل الإعلان',
            data:{
                adId:advertisement.id,
            },
            sentAt: new Date(),
        })
    }
}