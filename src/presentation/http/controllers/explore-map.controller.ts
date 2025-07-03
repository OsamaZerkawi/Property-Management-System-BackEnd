import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { ExploreMapDto } from "src/application/dtos/map/explore-map.dto";
import { ExploreMapUseCase } from "src/application/use-cases/map/explore-map.use-case";
import { Public } from "src/shared/decorators/public.decorator";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('map')
export class MapExploreController  {
    constructor(
       private readonly exploreMapUseCase: ExploreMapUseCase    ,
    ){}

    @Get('explore')
    @Public()
    @HttpCode(HttpStatus.OK)
    async exploreMap(
        @Query() data: ExploreMapDto
    ){
       const markers = await this.exploreMapUseCase.execute(data);
       
       return successResponse(markers, 'تم إرجاع العقارات والمكاتب ضمن حدود الخريطة المحددة بنجاح', 200);
    }
}