import { Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserPropertyInvoice } from "src/domain/entities/user-property-invoice.entity";
import { RentalContract } from "src/domain/entities/rental-contract.entity";
import { FindAllUserInvoicesUseCase } from "src/application/use-cases/user-invoices/find-all-user-invoices.use-case";
import { USER_PROPERTY_INVOICES_REPOSITORY } from "src/domain/repositories/user-property-invoices.repository";
import { UserPropertyInvoiceRepository } from "src/infrastructure/repositories/user-property-invoices.repository";
import { UserInvoiceController } from "../controllers/user-invoice.controller";
import { Residential } from "src/domain/entities/residential.entity";
import { Property } from "src/domain/entities/property.entity";
import { PropertyModule } from "./property.module";
import { ResidentialOfficeModule } from "./residential-office.module";
import { PropertyPost } from "src/domain/entities/property-posts.entitiy";
import { RegionModule } from "./region.module";
import { Region } from "src/domain/entities/region.entity";
import { UserModule } from "./user.module";
import { UserPropertyPurchase } from "src/domain/entities/user-property-purchase.entity";

@Module({
    imports:[
        AuthModule,
        UserModule,
        RegionModule,
        ResidentialOfficeModule,
        PropertyModule,
        TypeOrmModule.forFeature([
            UserPropertyInvoice,RentalContract,Residential,
            Property,PropertyPost,Region,UserPropertyPurchase,
        ])
    ],
    controllers:[UserInvoiceController],
    providers:[
        FindAllUserInvoicesUseCase,
        {
            provide:USER_PROPERTY_INVOICES_REPOSITORY,
            useClass:UserPropertyInvoiceRepository,
        }
    ],
    exports:[]  
})
export class UserInvoiceModule {}