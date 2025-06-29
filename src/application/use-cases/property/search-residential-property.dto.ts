import { Inject } from "@nestjs/common";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";

export class SearchResidentialPropertyByTitleUseCase {
    constructor(
        @Inject(PROPERTY_REPOSITORY)
        private readonly propertyRepo: PropertyRepositoryInterface,
    ){}

    async execute(userId: number,title: string,baseUrl: string){
        return await this.propertyRepo.searchPropertiesForOfficeByTitle(userId,title,baseUrl);
    }
}