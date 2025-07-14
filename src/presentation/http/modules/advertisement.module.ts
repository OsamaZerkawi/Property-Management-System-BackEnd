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

@Module({
    imports:[
        OfficeModule,
        AuthModule,
        TypeOrmModule.forFeature([Advertisement,OnlineInvoice,Office])
    ],
    controllers:[AdvertisementController],
    providers:[
        CreateAdvertisementUseCase,
        ListOfficeInvoicesUseCase,
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