import { Module } from "@nestjs/common";
import { ExploreMapUseCase } from "src/application/use-cases/map/explore-map.use-case";
import { MapExploreController } from "../controllers/explore-map.controller";
import { PropertyModule } from "./property.module";
import { OfficeModule } from "./office.module";

@Module({
    imports:[PropertyModule,OfficeModule],
    controllers:[MapExploreController],
    providers:[
        ExploreMapUseCase
    ],
})
export class MapExploreModule {}