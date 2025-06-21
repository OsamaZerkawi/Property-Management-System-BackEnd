import { Inject } from "@nestjs/common";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";

export class FindPropertyDetailsByIdUseCase {
    constructor(
        @Inject(PROPERTY_REPOSITORY)    
        private readonly propertyRepo: PropertyRepositoryInterface,
    ){}

    async execute(propertyId: number,baseUrl: string,){
        return await this.propertyRepo.findPropertyDetailsById(propertyId,baseUrl);
    }
}