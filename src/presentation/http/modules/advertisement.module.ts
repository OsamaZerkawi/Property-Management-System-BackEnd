import { forwardRef, Module } from "@nestjs/common";
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
import { ApproveAdvertisementRequestUseCase } from "src/application/use-cases/advertisement/approve-ad-request.use-case";
import { User } from "src/domain/entities/user.entity";
import { Notification } from "src/domain/entities/notification.entity";
import { NotificationModule } from "./notification.module";
import { AdvertisementScheduler } from "src/infrastructure/schedulers/advertisement.scheduler";
import { GetApprovedAdvertisementUseCase } from "src/application/use-cases/advertisement/get-approved-ads.use-case";
import { GetAllAdvertisementInvoicesUseCase } from "src/application/use-cases/advertisement/get-all-advertisement-invoices.use-case";
import { ServicePrice } from "src/domain/entities/service-price.entity";
import { ServicePriceModule } from "./service-price.module";
import { PromotedProperty } from "src/domain/entities/promoted-property.entity";
import { PropertyModule } from "./property.module";
import { Property } from "src/domain/entities/property.entity";
import { GetAdvertisementsUseCase } from "src/application/use-cases/advertisement/get-office-ads.use-case";
import { UpdateStripeCustomerUseCase } from "src/application/use-cases/user/update-stripe-customer.use-case";
import { GetStripeCustomerUseCase } from "src/application/use-cases/user/get-stripe-customer.use-case";

@Module({
    imports:[
        ServicePriceModule,
        PropertyModule,
        ServicePriceModule,
        NotificationModule,
        forwardRef(() => OfficeModule),
        AuthModule,
        TypeOrmModule.forFeature([Advertisement,OnlineInvoice,Office,Notification,User,ServicePrice,PromotedProperty,Property,])
    ],
    controllers:[AdvertisementController,FinanceAdsManagementController],
    providers:[
        AdvertisementScheduler,
        CreateAdvertisementUseCase,
        ListOfficeInvoicesUseCase,
        GetPendingAdvertisementUseCase,
        RejectAdRequestUseCase,
        ApproveAdvertisementRequestUseCase,
        GetApprovedAdvertisementUseCase,
        GetAllAdvertisementInvoicesUseCase,
        GetAdvertisementsUseCase,
        UpdateStripeCustomerUseCase,
        GetStripeCustomerUseCase,
        {
            provide: ADVERTISEMENT_REPOSITORY,
            useClass:AdvertisementRepository,
        }
    ], 
    exports: [ADVERTISEMENT_REPOSITORY],

})
export class AdvertisementModule{}