import { Inject } from "@nestjs/common";
import { USER_RESERVATION_REPOSITORY, UserReservationRepositoryInterface } from "src/domain/repositories/user-reservation.repostiory";

export class FindAllOwnReservationsUseCase {
    constructor(
        @Inject(USER_RESERVATION_REPOSITORY)
        private readonly userReservationRepo: UserReservationRepositoryInterface,
    ){}

    async execute(userId: number,baseUrl: string,page: number,items: number){
        const touristicReservations = await this.userReservationRepo.findTouristicReservationsByUser(userId,baseUrl);
        const residentialReservations = await this.userReservationRepo.findResidentialReservationsByUser(userId,baseUrl);

        const combined = [...touristicReservations, ...residentialReservations];

        const total = combined.length;
        const start = (page - 1) * items;
        const paginated = combined.slice(start, start + items);

        return {
            data : paginated,
            total,
        }
    }


}