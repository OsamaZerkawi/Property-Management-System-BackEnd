import { Inject } from "@nestjs/common";
import { PropertyType } from "src/domain/enums/property-type.enum";
import { USER_RESERVATION_REPOSITORY, UserReservationRepositoryInterface } from "src/domain/repositories/user-reservation.repostiory";

export class FindAllOwnReservationsUseCase {
    constructor(
        @Inject(USER_RESERVATION_REPOSITORY)
        private readonly userReservationRepo: UserReservationRepositoryInterface,
    ){}

    async execute(userId: number,type: PropertyType,baseUrl: string,page: number,items: number){
        let reservations = [];

        if(type === PropertyType.RESIDENTIAL){
            reservations = await this.userReservationRepo.findResidentialReservationsByUser(userId,baseUrl);
        }
        if(type === PropertyType.TOURISTIC){
            reservations = await this.userReservationRepo.findTouristicReservationsByUser(userId,baseUrl);
        }

        const total = reservations.length;
        const start = (page - 1) * items;
        const paginated = reservations.slice(start, start + items);

        return {
            data : paginated,
            total,
        }
    }


}