import { Inject, NotFoundException } from "@nestjs/common";
import { REGION_REPOSITORY, RegionRepositoryInterface } from "src/domain/repositories/region.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

export class FindRegionUseCase {
    constructor(
        @Inject(REGION_REPOSITORY)
        private readonly regionRepo : RegionRepositoryInterface
    ){}

    async execute(regionId: number){
        const region = await this.regionRepo.findById(regionId);

        if(!region){
            throw new NotFoundException(
                errorResponse('المنطقة غير موجودة',404)
            );
        }

        return region;
    }
}