import { Inject, Injectable } from "@nestjs/common";
import { REGION_REPOSITORY, RegionRepositoryInterface } from "src/domain/repositories/region.repository";

@Injectable()
export class getRegionsByCityIdUseCase {
    constructor(
        @Inject(REGION_REPOSITORY)
        private readonly regionRepo: RegionRepositoryInterface,
    ){}

     async execute(cityId: number){
        return await this.regionRepo.getRegionsByCityId(cityId);
    }
}