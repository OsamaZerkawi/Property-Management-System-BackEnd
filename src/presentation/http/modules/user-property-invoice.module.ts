import { Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserPropertyInvoice } from "src/domain/entities/user-property-invoice.entity";
import { USER_PROPERTY_INVOICES_REPOSITORY } from "src/domain/repositories/user-property-invoices.repository";
import { UserPropertyInvoiceRepository } from "src/infrastructure/repositories/user-property-invoices.repository";
import { UploadInvoiceDocumentUseCase } from "src/application/use-cases/user-property-reservation/upload-document-invoice.use-case";
import { UserPropertyInvoiceController } from "../controllers/user-property-invoice.controller";
import { ResidentialOfficeModule } from "./residential-office.module";
import { Property } from "src/domain/entities/property.entity";
import { Residential } from "src/domain/entities/residential.entity";
import { User } from "src/domain/entities/user.entity";
import { CreateUserProeprtyInvoiceUseCase } from "src/application/use-cases/user-property-reservation/create-user-property-invoice.use-case";
import { PropertyModule } from "./property.module";

@Module({
    imports:[
        AuthModule,
        PropertyModule,
        TypeOrmModule.forFeature([UserPropertyInvoice,Property,Residential,User])
    ],
    controllers:[UserPropertyInvoiceController],
    providers:[
        UploadInvoiceDocumentUseCase,
        CreateUserProeprtyInvoiceUseCase,
        {
            provide:USER_PROPERTY_INVOICES_REPOSITORY,
            useClass: UserPropertyInvoiceRepository
        }
    ],
    exports:[
        USER_PROPERTY_INVOICES_REPOSITORY
    ]
})
export class UserPropertyInvoiceModule{}