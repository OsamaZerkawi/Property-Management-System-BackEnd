import { Inject } from "@nestjs/common";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";

export class GetPropertyForOfficeUseCase {
    constructor(
        @Inject(PROPERTY_REPOSITORY)
        private readonly propertyRepo: PropertyRepositoryInterface
    ){}

    async execute(userId: number,propertyId: number,baseUrl: string){
        return await this.propertyRepo.findPropertyByPropertyIdAndUserOffice(userId,propertyId,baseUrl);
    }
}