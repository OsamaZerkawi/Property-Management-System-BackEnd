// src/presentation/http/modules/office.module.ts
import { Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Office } from "src/domain/entities/offices.entity";
import { OFFICE_REPOSITORY } from "src/domain/repositories/office.repository";
import { OfficeRepository } from "src/infrastructure/repositories/office.repository";
import { OfficeController } from "../controllers/office.controller";
import { Region } from "src/domain/entities/region.entity";
import { GetCommissionOfOfficeUseCase } from "src/application/use-cases/office/get-commission-of-office.use-case";
import { FindOfficeForUserUseCase } from "src/application/use-cases/office/find-office-for-user.use-case";
import { OfficeSocial } from "src/domain/entities/office-social.entity";
import { CreateOfficeUseCase } from "src/application/use-cases/office/create-office.usecase";
import { UpdateOfficeUseCase } from "src/application/use-cases/office/update-office.usecase";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Office, Region, OfficeSocial]),
  ],
  controllers: [OfficeController],
  providers: [
    GetCommissionOfOfficeUseCase,
    FindOfficeForUserUseCase,
    CreateOfficeUseCase,
    UpdateOfficeUseCase,
    {
      provide: OFFICE_REPOSITORY,
      useClass: OfficeRepository,
    },
  ],
  exports: [
    OFFICE_REPOSITORY,
    FindOfficeForUserUseCase,
  ],
})
export class OfficeModule {}
