import { Inject, NotFoundException } from "@nestjs/common";
import { REGION_REPOSITORY, RegionRepositoryInterface } from "src/domain/repositories/region.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

export class GetExpectedPriceForRegionUseCase {
    constructor(
        @Inject(REGION_REPOSITORY)
        private readonly regionRepo: RegionRepositoryInterface,
    ){}

    async execute(regionId: number){
        const region = await this.regionRepo.getExpectedpPrice(regionId);

        if(!region){
            throw new NotFoundException(
                errorResponse('لا يوجد منطقة لهذا المعرف',404)
            );
        }

        return {
            meter_price : region.default_meter_price
        };
    }
}