import { Inject } from "@nestjs/common";
import { ResidentialPropertiesSearchFiltersDto } from "src/application/dtos/property/residential-properties-search-filters.dto";
import { RESIDENTIAL_PROPERTY_REPOSITORY, ResidentialPropertyRepositoryInterface } from "src/domain/repositories/residential-property.repository";

export class SearchPropertyWithAdvancedFiltersUseCase {
    constructor(
        @Inject(RESIDENTIAL_PROPERTY_REPOSITORY)
        private readonly residentialPropertyRepo: ResidentialPropertyRepositoryInterface,
    ){}
    
    async execute(baseUrl: string,filters: ResidentialPropertiesSearchFiltersDto,page: number,items: number,userId: number){
        return await this.residentialPropertyRepo.searchFilteredResidentialsProperties(baseUrl,filters,page,items,userId);
    }
}