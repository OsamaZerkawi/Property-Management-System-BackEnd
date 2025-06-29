import { Inject } from "@nestjs/common";
import { PROPERTY_RESERVATION_REPOSITORY, PropertyReservationRepositoryInterface } from "src/domain/repositories/property-reservation.repository";

export class FindUserProeprtyReservationWithDetailsUseCase {
    constructor(
        @Inject(PROPERTY_RESERVATION_REPOSITORY)    
        private readonly propertyReservationRepo: PropertyReservationRepositoryInterface,
    ){}

    async execute(propertyReservationId: number,baseUrl: string){
        return await this.propertyReservationRepo.findUserPropertyReservationWithDetials(propertyReservationId,baseUrl);
    }
}