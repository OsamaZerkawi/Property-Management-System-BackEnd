import { Inject } from "@nestjs/common";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";

export class CompareTwoPropertiesUseCase {
    constructor(
        @Inject(PROPERTY_REPOSITORY)
        private readonly propertyRepo: PropertyRepositoryInterface,
    ){}

    async execute(propertyId1: number,propertyId2: number,userId: number,baseUrl: string){
        return await this.propertyRepo.compareTwoProperties(propertyId1,propertyId2,userId,baseUrl);
    }
}