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
import { ReminderType } from "src/domain/enums/reminder-type.enum";
import { InvoiceReminderLog } from "src/domain/entities/invoice-reminder-log.entity";
import { ReminderService } from "src/application/services/reminder.service";
import { NotificationModule } from "./notification.module";
import { ReminderModule } from "./reminder.module";
import { PayInvoiceUseCase } from "src/application/use-cases/user-invoices/pay-invoice.usecase";
import { UploadInvoiceDocumentUseCase } from 'src/application/use-cases/rental/upload-document-invoice.use-case';

@Module({
    imports:[
        ReminderModule,
        AuthModule,
        UserModule,
        RegionModule,
        ResidentialOfficeModule,
        PropertyModule,
        TypeOrmModule.forFeature([
            UserPropertyInvoice,RentalContract,Residential,
            Property,PropertyPost,Region,UserPropertyPurchase,
            InvoiceReminderLog,
        ])
    ],
    
    controllers:[UserInvoiceController],
    providers:[
        FindAllUserInvoicesUseCase,
        PayInvoiceUseCase,
        UploadInvoiceDocumentUseCase,
        {
            provide:USER_PROPERTY_INVOICES_REPOSITORY,
            useClass:UserPropertyInvoiceRepository,
        }
    ],
    exports:[]  
})
export class UserInvoiceModule {}