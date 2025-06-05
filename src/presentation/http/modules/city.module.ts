import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CITY_REPOSITORY } from "src/domain/repositories/city.repository";
import { CityRepository } from "src/infrastructure/repositories/city.repository";
import { AuthModule } from "./auth.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { jwtConfig } from "src/infrastructure/config/jwt.config";
import { City } from "src/domain/entities/city.entity";
import { Region } from "src/domain/entities/region.entity";
import { CityController } from "../controllers/city.controller";
import { GetAllCitiesUseCase } from "src/application/use-cases/city/get-cities.use-case";

@Module({
    imports:[
        AuthModule,
        TypeOrmModule.forFeature([City,Region]),
        JwtModule.registerAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: jwtConfig
        })
    ],
    controllers:[CityController],
    providers:[
        GetAllCitiesUseCase,
        {
            provide:CITY_REPOSITORY,
            useClass:CityRepository
        }
    ],
    exports:[
        CITY_REPOSITORY
    ]
})
export class CityModule {}