import { Inject } from "@nestjs/common";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";
import { RESIDENTIAL_PROPERTY_REPOSITORY, ResidentialPropertyRepositoryInterface } from "src/domain/repositories/residential-property.repository";
import { ITourismRepository, TOURISM_REPOSITORY } from "src/domain/repositories/tourism.repository";

export class GetPropertiesForOfficeUseCase {
    constructor(
        @Inject(PROPERTY_REPOSITORY)
        private readonly propertyRepo: PropertyRepositoryInterface,
        @Inject(TOURISM_REPOSITORY)
        private readonly touristicPropertyRepo: ITourismRepository,
    ) { }

    async execute(officeId: number, baseUrl: string) {
        const properties = await this.propertyRepo.findPropertiesByUserOffice(officeId, baseUrl);

        const touristicProperties = await this.touristicPropertyRepo.findAllByOffice(officeId, baseUrl);

        return [
            ...properties,
            ...touristicProperties
        ];
    }
}