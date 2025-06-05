import { Inject } from "@nestjs/common";
import { CreatePropertyDto } from "src/application/dtos/property/CreateProperty.dto";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";

export class CreatePropertyUseCase{
    constructor(
        @Inject(PROPERTY_REPOSITORY)
        private readonly propertyRepo: PropertyRepositoryInterface
    ){}

    async execute(data : CreatePropertyDto){
        return await this.propertyRepo.createPropertyAndSaveIt(data);
    }
}