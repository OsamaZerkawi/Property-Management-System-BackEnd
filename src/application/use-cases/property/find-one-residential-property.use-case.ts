import { Inject, NotFoundException } from "@nestjs/common";
import { RESIDENTIAL_PROPERTY_REPOSITORY, ResidentialPropertyRepositoryInterface } from "src/domain/repositories/residential-property.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

export class FindOneResidentialPropertyUseCase {
    constructor(
        @Inject(RESIDENTIAL_PROPERTY_REPOSITORY)
        private readonly residentialRepo: ResidentialPropertyRepositoryInterface,
    ){}

    async execute(id: number){
        const residentialProperty = await this.residentialRepo.findById(id);

        if(!residentialProperty){
            throw new NotFoundException(
                errorResponse('العقار غير موجود ',404)
            );
        }

        return residentialProperty;
    }
}