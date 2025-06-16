import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { GetExpectedPriceForRegionUseCase } from "src/application/use-cases/region/get-expected-price-for-region.use-case";
import { getRegionsByCityIdUseCase } from "src/application/use-cases/region/get-regions-by-city-id.use-case";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('region')
export class RegionController {
    constructor(
        private readonly getRegionsByCityIdUseCase : getRegionsByCityIdUseCase,
        private readonly getExpectedPriceForRegionUseCase: GetExpectedPriceForRegionUseCase,
    ){}

    @Get('/cities/:cityId')
    @HttpCode(HttpStatus.OK)
    async getRegionsByCity(
        @Param('cityId',ParseIntPipe) cityId: number
    ){
        const regions = await this.getRegionsByCityIdUseCase.execute(cityId);

        return successResponse(regions,'تم ارجاع المدن الخاصة بالمحافظة بنجاح',200)
    }

    @Get(':regionId')
    @HttpCode(HttpStatus.OK)    
    async getExpectedPriceForRegion(
        @Param('regionId') regionId: number,
    ){
       const data = await this.getExpectedPriceForRegionUseCase.execute(regionId);

       return successResponse(data,'تم ارجاع سعر المتر في المنطقة',200);
    }
}