import { Inject } from "@nestjs/common";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";

export class GetPropertiesForOfficeUseCase {
    constructor(
        @Inject(PROPERTY_REPOSITORY)
        private readonly propertyRepo: PropertyRepositoryInterface
    ){}

    async execute(userId: number,baseUrl: string){
        return await this.propertyRepo.findPropertiesByUserOffice(userId,baseUrl);
    }
}