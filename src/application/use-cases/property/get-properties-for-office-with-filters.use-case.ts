import { Inject } from "@nestjs/common";
import { SearchPropertiesDto } from "src/application/dtos/property/search-properties.dto";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";

export class GetPropertiesForOfficeWithFiltersUseCase {
    constructor(
        @Inject(PROPERTY_REPOSITORY)
        private readonly propertyRepo: PropertyRepositoryInterface
    ){}

    async execute(userId: number,filters: SearchPropertiesDto,baseUrl: string){
        return this.propertyRepo.findPropertiesByUserOfficeWithFilters(userId,filters,baseUrl);
    }
}