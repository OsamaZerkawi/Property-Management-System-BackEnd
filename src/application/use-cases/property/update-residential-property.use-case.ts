import { Inject } from "@nestjs/common";
import { UpdateResidentialPropertyDetailsDto } from "src/application/dtos/property/UpdateResidentialPropertyDetails.dto";
import { RESIDENTIAL_PROPERTY_REPOSITORY, ResidentialPropertyRepositoryInterface } from "src/domain/repositories/residential-property.repository";

export class UpdateResidentialPropertyUseCase {
    constructor(
        @Inject(RESIDENTIAL_PROPERTY_REPOSITORY)
        private readonly residentialRepo: ResidentialPropertyRepositoryInterface
    ){}

    async execute(id: number,data: UpdateResidentialPropertyDetailsDto){
        return await this.residentialRepo.updateResidentialProperty(id,data);
    }
}