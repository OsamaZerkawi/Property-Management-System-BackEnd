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
import { AuthTokenBlackListService } from 'src/application/services/authTokenBlacklist.service';
import { AuthModule } from './auth.module';
import { PropertyModule } from './property.module';
import { GetRentalContractsUseCase } from 'src/application/use-cases/rental/get-rental-contracts.use-case';
 
 

@Module({
  imports: [ 
    AuthModule,
    PropertyModule,
    TypeOrmModule.forFeature([
      RentalContract, 
      UserPropertyInvoice,
      Property,
      Office,
      PropertyFeedback,
      OfficeSocial,
      User
    ]),
  ],
  controllers: [RentalContractController],
  providers: [
    CreateRentalContractUseCase,
    GetRentalContractsUseCase,
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