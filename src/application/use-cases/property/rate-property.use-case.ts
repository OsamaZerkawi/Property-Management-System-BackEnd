import { Inject } from "@nestjs/common";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";

export class RatePropertyUseCase {
    constructor(
        @Inject(PROPERTY_REPOSITORY)    
        private readonly propertyRepo: PropertyRepositoryInterface,
    ){}

    async execute(userId: number,propertyId: number,rate: number){
        return await this.propertyRepo.rateProperty(userId,propertyId,rate);
    }
}