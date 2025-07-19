import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Advertisement } from "src/domain/entities/advertisements.entity";
import { OnlineInvoice } from "src/domain/entities/online-invoices.entity";
import { AuthModule } from "./auth.module";
import { AdvertisementController } from "../controllers/advertisement.controller";
import { Office } from "src/domain/entities/offices.entity";
import { ADVERTISEMENT_REPOSITORY } from "src/domain/repositories/advertisement.repository";
import { AdvertisementRepository } from "src/infrastructure/repositories/advertisement.repository";
import { OfficeModule } from "./office.module";
import { CreateAdvertisementUseCase } from "src/application/use-cases/advertisement/create-advertisement.use-case";
import { ListOfficeInvoicesUseCase } from "src/application/use-cases/advertisement/list-advertisement-invoices.use-case";
import { FinanceAdsManagementController } from "../controllers/finance-ads-management.controller";
import { GetPendingAdvertisementUseCase } from "src/application/use-cases/advertisement/get-pending-ads.use-case";
import { RejectAdRequestUseCase } from "src/application/use-cases/advertisement/reject-ad-request.use-case";
import { ApproveAdRequestUseCase } from "src/application/use-cases/advertisement/approve-ad-request.use-case";
import { User } from "src/domain/entities/user.entity";
import { Notification } from "src/domain/entities/notification.entity";
import { NotificationModule } from "./notification.module";
import { AdvertisementScheduler } from "src/infrastructure/schedulers/advertisement.scheduler";

@Module({
    imports:[
        NotificationModule,
        OfficeModule,
        AuthModule,
        TypeOrmModule.forFeature([Advertisement,OnlineInvoice,Office,Notification,User])
    ],
    controllers:[AdvertisementController,FinanceAdsManagementController],
    providers:[
        AdvertisementScheduler,
        CreateAdvertisementUseCase,
        ListOfficeInvoicesUseCase,
        GetPendingAdvertisementUseCase,
        RejectAdRequestUseCase,
        ApproveAdRequestUseCase,
        {
            provide: ADVERTISEMENT_REPOSITORY,
            useClass:AdvertisementRepository,
        }
    ],
    exports:[
        ADVERTISEMENT_REPOSITORY
    ]
})
export class AdvertisementModule{

}