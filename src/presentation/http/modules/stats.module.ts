import { Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Office } from "src/domain/entities/offices.entity";
import { ServiceProvider } from "src/domain/entities/service-provider.entity";
import { StatsController } from "../controllers/stats.controller";
import { STATS_REPOSITORY } from "src/domain/repositories/stats.repository";
import { StatsRepository } from "src/infrastructure/repositories/stats.repository";
import { City } from "src/domain/entities/city.entity";
import { Region } from "src/domain/entities/region.entity";
import { GetPopularStatsUseCase } from "src/application/use-cases/stats/get-popular-stats.use-case";
import { GetPublicInfoStatsUseCase } from "src/application/use-cases/stats/get-public-info-status.use-case";

@Module({
    imports:[
        AuthModule,
        TypeOrmModule.forFeature([Office,ServiceProvider,City,Region])
    ],
    controllers:[StatsController],
    providers:[
        GetPopularStatsUseCase,
        GetPublicInfoStatsUseCase,
        {
            provide: STATS_REPOSITORY,
            useClass: StatsRepository
        }
    ],
})
export class StatsModule {}