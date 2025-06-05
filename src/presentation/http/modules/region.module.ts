import { Module } from "@nestjs/common";
import { getRegionsByCityIdUseCase } from "src/application/use-cases/region/get-regions-by-city-id.use-case";
import { REGION_REPOSITORY } from "src/domain/repositories/region.repository";
import { RegionRepository } from "src/infrastructure/repositories/region.repository";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { jwtConfig } from "src/infrastructure/config/jwt.config";
import { Region } from "src/domain/entities/region.entity";
import { City } from "src/domain/entities/city.entity";
import { RegionController } from "../controllers/region.controller";

@Module({
    imports:[
        AuthModule,
        TypeOrmModule.forFeature([Region,City]),
        JwtModule.registerAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: jwtConfig
        })
    ],
    controllers:[RegionController],
    providers:[
        getRegionsByCityIdUseCase,
        {
            provide:REGION_REPOSITORY,
            useClass: RegionRepository
        }
    ],
    exports: [
        REGION_REPOSITORY,
    ]
})
export class RegionModule{}