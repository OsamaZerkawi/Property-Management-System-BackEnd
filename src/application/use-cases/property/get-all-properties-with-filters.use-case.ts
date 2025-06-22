import { Inject } from "@nestjs/common";
import { PropertiesFiltersDto } from "src/application/dtos/property/PropertiesFilters.dto";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";

export class GetAllPropertiesWithFiltersUseCase {
    constructor (
        @Inject(PROPERTY_REPOSITORY)    
        private readonly propertyRepo: PropertyRepositoryInterface,
    ){}

    async execute(baseUrl: string,filters: PropertiesFiltersDto,page: number,items: number,userId: number){
        return await this.propertyRepo.getAllPropertiesWithFilters(baseUrl,filters,page,items,userId);
    }
}