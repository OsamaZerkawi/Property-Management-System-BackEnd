import { Inject } from "@nestjs/common";
import { PROPERTY_RESERVATION_REPOSITORY, PropertyReservationRepositoryInterface } from "src/domain/repositories/property-reservation.repository";

export class FindPropertyReservationDetails{
    constructor(
        @Inject(PROPERTY_RESERVATION_REPOSITORY)    
        private readonly propertyReservationRepo: PropertyReservationRepositoryInterface,
    ){}

    async execute(propertyId: number){
        return await this.propertyReservationRepo.findPropertyReservationDetails(propertyId);
    }
}