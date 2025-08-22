import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Office } from "src/domain/entities/offices.entity";
import { OFFICE_REPOSITORY } from "src/domain/repositories/office.repository";
import { OfficeRepository } from "src/infrastructure/repositories/office.repository";
import { OfficeController } from "../controllers/office.controller";
import { Region } from "src/domain/entities/region.entity";
import { GetCommissionOfOfficeUseCase } from "src/application/use-cases/office/get-commission-of-office.use-case";
import { FindOfficeForUserUseCase } from "src/application/use-cases/office/find-office-for-user.use-case"; 
import { CreateOfficeUseCase } from "src/application/use-cases/office/create-office.usecase";
import { UpdateOfficeUseCase } from "src/application/use-cases/office/update-office.usecase";
import { GetOfficeDetailsUseCase } from "src/application/use-cases/office/get-office-details.usecase";
import { GetOfficePaymentMethodUseCase } from "src/application/use-cases/office/get-office-payment-method.use-case";
import { GetOfficeFeesUseCase } from "src/application/use-cases/office/get-office-fees.use-case";
import { UpdateOfficeFeesUseCase } from "src/application/use-cases/office/update-office-fees.use-case";
import { GetTopRatedOfficesUseCase } from "src/application/use-cases/office/get-top-rated-offices.use-case";
import { OfficeSocial } from "src/domain/entities/office-social.entity";
import { OfficeFeedback } from "src/domain/entities/office-feedback.entity"; 
import { PropertyFeeService } from "src/application/services/propertyFee.service";  
import { ResidentialOfficeModule } from "./residential-office.module";
import { ListOfficesUseCase } from "src/application/use-cases/office/list-offices.use-case";
import { SearchOfficesUseCase } from "src/application/use-cases/office/search-office-by-name.use-case";
import { RateOfficeUseCase } from "src/application/use-cases/office/rate-office.usecase";
import { ComplaintOfficeUseCase } from "src/application/use-cases/office/comlaint-office.use-case";
import { GetOfficeDetailsMobileUseCase } from "src/application/use-cases/office/show-office-details-mobile";
import { GetOfficePropertiesUseCase } from "src/application/use-cases/office/get-office-properties.use-case";
import { PropertyModule } from "./property.module";
import { AdvertisementModule } from "./advertisement.module";
import { GetPropertiesForOfficeUseCase } from "src/application/use-cases/property/get-properties-for-office.use-case";
import { SocialPlatform } from "src/domain/entities/social_platforms.entity";
import { GetOfficeDashboardUseCase } from "src/application/use-cases/office/get-office-dashboard.use-case";
import { GetTopRegionsUseCase } from "src/application/use-cases/office/get-top-region.use-case";
import { RESIDENTIAL_PROPERTY_REPOSITORY } from "src/domain/repositories/residential-property.repository";
import { ResidentialPropertyRepository } from "src/infrastructure/repositories/residetial-property.repository";
import { TOURISM_REPOSITORY } from "src/domain/repositories/tourism.repository";
import { TourismRepository } from "src/infrastructure/repositories/tourism.repository";
import { TourismModule } from "./tourism.module";
import { Residential } from "src/domain/entities/residential.entity";

@Module({
  imports: [
    AuthModule, 
    PropertyModule,
    forwardRef(() => ResidentialOfficeModule), 
    forwardRef(() => TourismModule),      
    TypeOrmModule.forFeature([Office, Region, OfficeSocial, SocialPlatform,OfficeFeedback,Residential
]),
  ],
  controllers: [OfficeController],
  providers: [
    GetOfficeFeesUseCase,
    UpdateOfficeFeesUseCase,
    GetTopRatedOfficesUseCase,
    GetCommissionOfOfficeUseCase,
    CreateOfficeUseCase,
    UpdateOfficeUseCase,
    GetOfficeDetailsUseCase,
    GetOfficePaymentMethodUseCase,
    FindOfficeForUserUseCase, 
    ListOfficesUseCase,
    SearchOfficesUseCase,
    RateOfficeUseCase,
    ComplaintOfficeUseCase,
    GetOfficeDetailsMobileUseCase,
    GetOfficePropertiesUseCase, 
    GetPropertiesForOfficeUseCase,
    GetOfficeDashboardUseCase,
    GetTopRegionsUseCase,
    {
      provide: OFFICE_REPOSITORY,
      useClass: OfficeRepository
    }, 
    PropertyFeeService,
  ],
  exports: [
    OFFICE_REPOSITORY,
    FindOfficeForUserUseCase,
    GetOfficePaymentMethodUseCase,
    GetPropertiesForOfficeUseCase,
  ],
})
export class OfficeModule {}
