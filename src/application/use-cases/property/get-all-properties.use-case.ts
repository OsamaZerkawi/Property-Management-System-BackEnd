import { Inject } from "@nestjs/common";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";

export class GetAllPropertiesUseCase {
    constructor(
        @Inject(PROPERTY_REPOSITORY)    
        private readonly propertyRepo: PropertyRepositoryInterface,
    ){}

    async execute(baseUrl: string,page: number,items: number,userId: number){
        return await this.propertyRepo.getAllProperties(baseUrl,page,items,userId);
    }
}