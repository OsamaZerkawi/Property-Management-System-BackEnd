import { Inject } from "@nestjs/common";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";

export class GetExpectedPricePropertyUseCase{
    constructor(
        @Inject(PROPERTY_REPOSITORY)
        private readonly propertyRepo: PropertyRepositoryInterface,
    ){}

    async execute(propertyId: number){
        return await this.propertyRepo.getExpectedpPriceInRegion(propertyId);
    }
}