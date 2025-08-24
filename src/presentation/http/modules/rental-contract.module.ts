// src/infrastructure/modules/rental-contract.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalContract } from 'src/domain/entities/rental-contract.entity';
import { UserPropertyInvoice } from 'src/domain/entities/user-property-invoice.entity';
import { Property } from 'src/domain/entities/property.entity';
import { CreateRentalContractUseCase } from 'src/application/use-cases/rental/create-rental-contract.use-case';
import { PropertyRepository } from 'src/infrastructure/repositories/property.repository';
import { RENTAL_CONTRACT_REPOSITORY } from 'src/domain/repositories/rental-contract.repository';
import { USER_PROPERTY_INVOICES_REPOSITORY}from 'src/domain/repositories/user-property-invoices.repository';
import { PROPERTY_REPOSITORY } from 'src/domain/repositories/property.repository';
import { UserPropertyInvoiceRepository } from 'src/infrastructure/repositories/user-property-invoices.repository';
import { RentalContractRepository } from 'src/infrastructure/repositories/rental-contract.repository';
import { RentalContractController } from '../controllers/rental-contract.controller';
import { Office } from 'src/domain/entities/offices.entity';
import { OFFICE_REPOSITORY } from 'src/domain/repositories/office.repository';
import { OfficeRepository } from 'src/infrastructure/repositories/office.repository';
import { USER_REPOSITORY } from 'src/domain/repositories/user.repository';
import { UserRepository } from 'src/infrastructure/repositories/user.property';
import { PropertyFeedback } from 'src/domain/entities/property-feedback.entity';
import { OfficeSocial } from 'src/domain/entities/office-social.entity';
import { User } from 'src/domain/entities/user.entity';
import { AuthModule } from './auth.module';
import { PropertyModule } from './property.module';
import { GetRentalContractsUseCase } from 'src/application/use-cases/rental/get-rental-contracts.use-case';
import { UploadInvoiceDocumentUseCase } from 'src/application/use-cases/rental/upload-document-invoice.use-case';
import { SearchRentalContractsUseCase } from 'src/application/use-cases/rental/search-rental-contracts.use-case';
import { GetContractDetailsUseCase } from 'src/application/use-cases/rental/get-contract-details.use-case';
import { ResidentialOfficeModule } from './residential-office.module';
import { Residential } from 'src/domain/entities/residential.entity';
import { RegionModule } from './region.module';
import { Region } from 'src/domain/entities/region.entity';
import { UserModule } from './user.module';
import { UserPropertyPurchase } from 'src/domain/entities/user-property-purchase.entity';
import { ReminderService } from 'src/application/services/reminder.service';
import { InvoiceReminderLog } from 'src/domain/entities/invoice-reminder-log.entity';
import { NotificationModule } from './notification.module';
import { ReminderModule } from './reminder.module';
import { Image } from 'src/domain/entities/image.entity';
import { CreateRentalRequestUseCase } from 'src/application/use-cases/rental/create-rental-request.use-case';
  

@Module({
  imports: [ 
    ReminderModule,
    AuthModule,
    PropertyModule,
    UserModule,
    RegionModule,
    ResidentialOfficeModule,
    TypeOrmModule.forFeature([
      RentalContract,UserPropertyInvoice,Property,
      Office,PropertyFeedback,OfficeSocial,Residential,
      User,Region,UserPropertyPurchase,InvoiceReminderLog,Image,
    ]),
  ],
  controllers: [RentalContractController],
  providers: [
    CreateRentalContractUseCase,
    GetRentalContractsUseCase,
    UploadInvoiceDocumentUseCase,
    SearchRentalContractsUseCase,
    GetContractDetailsUseCase,
    CreateRentalRequestUseCase,
    {
      provide: RENTAL_CONTRACT_REPOSITORY,
      useClass: RentalContractRepository,
    },
    {
      provide: USER_PROPERTY_INVOICES_REPOSITORY,
      useClass: UserPropertyInvoiceRepository,
    },
    {
      provide: PROPERTY_REPOSITORY,
      useClass: PropertyRepository,
    },
     {
      provide: OFFICE_REPOSITORY,
      useClass: OfficeRepository
    },
     {
      provide: USER_REPOSITORY,  
      useClass: UserRepository,
    },
  ],
})
export class RentalContractModule {}