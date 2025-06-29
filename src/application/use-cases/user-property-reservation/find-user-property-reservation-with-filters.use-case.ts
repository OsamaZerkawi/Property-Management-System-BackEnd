import { Inject } from "@nestjs/common";
import { PROPERTY_RESERVATION_REPOSITORY, PropertyReservationRepositoryInterface } from "src/domain/repositories/property-reservation.repository";
import { PropertyReservationFiltersDto } from "src/application/dtos/user-property-reservation/PropertyReservationFilters.dto";

export class FindUserProeprtyReservationsWithFiltersUseCase {
    constructor(
        @Inject(PROPERTY_RESERVATION_REPOSITORY)
        private readonly propertyReservationRepo: PropertyReservationRepositoryInterface
    ){}

    async execute(baseUrl: string, filters: PropertyReservationFiltersDto){
        return await this.propertyReservationRepo.findAllPropertyReservationsWithFilters(baseUrl,filters);
    }
}