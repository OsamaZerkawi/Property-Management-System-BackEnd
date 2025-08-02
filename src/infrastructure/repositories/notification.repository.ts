import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { retry } from "rxjs";
import { FcmToken } from "src/domain/entities/fcmToken.entity";
import { Notification } from "src/domain/entities/notification.entity";
import { NotificationRepositoryInterface } from "src/domain/repositories/notification.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { Repository } from "typeorm";

export class NotificationRepository implements NotificationRepositoryInterface {
    constructor (
        @InjectRepository(Notification) 
        private readonly notificationRepo: Repository<Notification>,
        @InjectRepository(FcmToken)
        private readonly fcmTokenRepo: Repository<FcmToken>,
    ){}
    create(notificationData: Partial<Notification>) {
        const notification = this.notificationRepo.create(notificationData);

        return this.notificationRepo.save(notification);
    }
    findByUser(userId: number) {
        return this.notificationRepo.find({
            where: {userId},
            order:{sent_at: 'DESC'}   
        });
    }
    async markAsRead(id: number) {
       const notification = await this.notificationRepo.findOne({ where: { id } });
     
       if (!notification) {
         throw new NotFoundException(
            errorResponse(`لم يتم العثور على الإشعار بالمعرف ${id}.`,404)
         );
       }
     
       notification.isRead = true;
       await this.notificationRepo.save(notification);
    }
    async getFcmTokensByUserId(userId: number) {
        const  tokens = await this.fcmTokenRepo.find({
            where: {user :{id: userId}}
        });
        
        return tokens.map(tokenEntity => tokenEntity.fcmToken);
    }

    async getFcmTokenByUserId(userId: number) {
        const token =  await this.fcmTokenRepo.findOne({
            where: {user :{id: userId}}
        });

        return token?.fcmToken;
    }
}