import { Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { jwtConfig } from "src/infrastructure/config/jwt.config";
import { Office } from "src/domain/entities/offices.entity";
import { OFFICE_REPOSITORY } from "src/domain/repositories/office.repository";
import { OfficeRepository } from "src/infrastructure/repositories/office.repository";

@Module({
    imports: [
    AuthModule,
        TypeOrmModule.forFeature([Office]),
        JwtModule.registerAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: jwtConfig
        })
    ],
    controllers:[],
    providers:[
        {
            provide: OFFICE_REPOSITORY,
            useClass: OfficeRepository
        }
    ],
    exports:[
        OFFICE_REPOSITORY,
    ]
})
export class OfficeModule{}