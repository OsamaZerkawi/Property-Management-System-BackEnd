import { Inject } from "@nestjs/common";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";

export class SearchPropertiesByTitleUseCase {
    constructor(
        @Inject(PROPERTY_REPOSITORY)    
        private readonly propertyRepo: PropertyRepositoryInterface,
    ){}

    async execute(title: string,baseUrl: string,page: number,items: number){
        return await this.propertyRepo.searchPropertyByTitle(title,baseUrl,page,items);
    }
}