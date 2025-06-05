import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe } from "@nestjs/common";
import { getRegionsByCityIdUseCase } from "src/application/use-cases/region/get-regions-by-city-id.use-case";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('region')
export class RegionController {
    constructor(
        private readonly getRegionsByCityIdUseCase : getRegionsByCityIdUseCase,
    ){}

    @Get('/cities/:cityId')
    @HttpCode(HttpStatus.OK)
    async getRegionsByCity(
        @Param('cityId',ParseIntPipe) cityId: number
    ){
        const regions = await this.getRegionsByCityIdUseCase.execute(cityId);

        return successResponse(regions,'تم ارجاع المدن الخاصة بالمحافظة بنجاح',200)
    }
}