import { Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { jwtConfig } from "src/infrastructure/config/jwt.config";
import { Office } from "src/domain/entities/offices.entity";
import { OFFICE_REPOSITORY } from "src/domain/repositories/office.repository";
import { OfficeRepository } from "src/infrastructure/repositories/office.repository";
import { OfficeController } from "../controllers/office.controller";
import { Region } from "src/domain/entities/region.entity";
import { Property } from "src/domain/entities/property.entity";
import { GetCommissionOfOfficeUseCase } from "src/application/use-cases/office/get-commission-of-office.use-case";
import { FindOfficeForUserUseCase } from "src/application/use-cases/office/find-office-for-user.use-case";

@Module({
    imports: [
    AuthModule,
        TypeOrmModule.forFeature([Office,Region]),
    ],
    controllers:[OfficeController],
    providers:[
        GetCommissionOfOfficeUseCase,
        FindOfficeForUserUseCase,
        {
            provide: OFFICE_REPOSITORY,
            useClass: OfficeRepository
        }
    ],
    exports:[
        OFFICE_REPOSITORY,
        FindOfficeForUserUseCase,
    ]
})
export class OfficeModule{}