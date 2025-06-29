import { PropertyReservationFiltersDto } from "src/application/dtos/user-property-reservation/PropertyReservationFilters.dto";

export const PROPERTY_RESERVATION_REPOSITORY = 'PROPERTY_RESERVATION_REPOSITORY';

export interface PropertyReservationRepositoryInterface {
    findAllPropertyReservations(baseUrl: string);
    findAllPropertyReservationsWithFilters(baseUrl: string,filters: PropertyReservationFiltersDto);
    findUserPropertyReservationWithDetials(id: number,baseUrl: string);
    findPropertyReservationDetails(propertyId: number);
}