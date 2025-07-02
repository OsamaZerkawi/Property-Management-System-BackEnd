import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Booking } from "src/domain/entities/booking.entity";
import { Calendar } from "src/domain/entities/calendar.entity";
import { RentalContract } from "src/domain/entities/rental-contract.entity";
import { Touristic } from "src/domain/entities/touristic.entity";
import { AuthModule } from "./auth.module";
import { Region } from "src/domain/entities/region.entity";
import { City } from "src/domain/entities/city.entity";
import { UserReservationController } from "../controllers/user-reservation.controller";
import { USER_RESERVATION_REPOSITORY } from "src/domain/repositories/user-reservation.repostiory";
import { UserReservationRepository } from "src/infrastructure/repositories/user-reservation.repository";
import { FindAllOwnReservationsUseCase } from "src/application/use-cases/user-property-reservation/find-all-own-reservation.use-case";

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Touristic,Booking,Calendar,RentalContract,Region,City])
    ],
    controllers:[UserReservationController],
    providers:[
        FindAllOwnReservationsUseCase,
        {
            provide:USER_RESERVATION_REPOSITORY,
            useClass: UserReservationRepository
        }
    ],
    exports:[
        USER_RESERVATION_REPOSITORY,
    ]
})
export class UserReservationModule {}