import { Inject } from "@nestjs/common";
import { ResidentialPropertyDto } from "src/application/dtos/property/ResidentialProperty.dto";
import { RESIDENTIAL_PROPERTY_REPOSITORY, ResidentialPropertyRepositoryInterface } from "src/domain/repositories/residential-property.repository";

export class createResidentialPropertyUseCase {
    constructor(
        @Inject(RESIDENTIAL_PROPERTY_REPOSITORY)
        private readonly residentialPropertyRepo: ResidentialPropertyRepositoryInterface
    ){}

    async execute(data: ResidentialPropertyDto){
        return await this.residentialPropertyRepo.createResidentialPropertyAndSaveIt(data);
    }
}