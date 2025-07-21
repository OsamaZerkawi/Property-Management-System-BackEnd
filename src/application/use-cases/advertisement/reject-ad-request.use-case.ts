import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { RespondToAdRequestDto } from "src/application/dtos/advertisement/respond-to-ad-request.dto";
import { AdminAgreement } from "src/domain/enums/admin-agreement.enum";
import { ADVERTISEMENT_REPOSITORY, AdvertisementRepositoryInterface } from "src/domain/repositories/advertisement.repository";
import { NOTIFICATION_REPOSITORY, NotificationRepositoryInterface } from "src/domain/repositories/notification.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { Admin } from "typeorm";

@Injectable()
export class RejectAdRequestUseCase {
    constructor(
        @Inject(ADVERTISEMENT_REPOSITORY)
        private readonly advertisementRepo: AdvertisementRepositoryInterface,
        @Inject(NOTIFICATION_REPOSITORY)
        private readonly notificationRepo: NotificationRepositoryInterface,
    ){}

    async execute(adId: number,reason?: string){
        const advertisement = await this.advertisementRepo.findById(adId);
        if(!advertisement){
            throw new NotFoundException(
                errorResponse('الإعلان غير موجود',404)
            );
        }

        await this.advertisementRepo.update(adId,{
            admin_agreement: AdminAgreement.REJECTED,
        });

        const user = advertisement.office.user;

        await this.notificationRepo.create({
            userId: user.id,
            title: 'تم رفض إعلانك',
            body: reason || 'الإعلان لا يطابق الشروط',
            data:{
                adId: advertisement.id,
                reason: reason || 'الإعلان لا يطابق الشروط',
            },
            sent_at: new Date(),
        })
    }
}