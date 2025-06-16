import { Inject } from "@nestjs/common";
import { PROPERTY_RESERVATION_REPOSITORY, PropertyReservationRepositoryInterface } from "src/domain/repositories/property-reservation.repository";

export class FindUserProeprtyReservationsUseCase {
    constructor(
        @Inject(PROPERTY_RESERVATION_REPOSITORY)
        private readonly propertyReservationRepo: PropertyReservationRepositoryInterface
    ){}

    async execute(baseUrl: string){
        return await this.propertyReservationRepo.findAllPropertyReservations(baseUrl);
    }
}