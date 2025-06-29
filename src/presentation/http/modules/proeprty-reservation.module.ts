import { Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { PropertyReservationController } from "../controllers/property-reservation.controller";
import { PROPERTY_RESERVATION_REPOSITORY } from "src/domain/repositories/property-reservation.repository";
import { PropertyReservationRepository } from "src/infrastructure/repositories/proeprty-reservation.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserPropertyPurchase } from "src/domain/entities/user-property-purchase.entity";
import { Office } from "src/domain/entities/offices.entity";
import { PropertyPost } from "src/domain/entities/property-posts.entitiy";
import { Region } from "src/domain/entities/region.entity";
import { City } from "src/domain/entities/city.entity";
import { Residential } from "src/domain/entities/residential.entity";
import { FindUserProeprtyReservationsUseCase } from "src/application/use-cases/user-property-reservation/find-user-property-reservation.use-case";
import { FindUserProeprtyReservationsWithFiltersUseCase } from "src/application/use-cases/user-property-reservation/find-user-property-reservation-with-filters.use-case";
import { UserPropertyInvoiceModule } from "./user-property-invoice.module";
import { Property } from "src/domain/entities/property.entity";
import { FindUserProeprtyReservationWithDetailsUseCase } from "src/application/use-cases/user-property-reservation/find-user-property-reservation-with-details.use-case";
import { ResidentialOfficeModule } from "./residential-office.module";
import { FindPropertyReservationDetails } from "src/application/use-cases/user-property-reservation/find-property-reservation-details.use-case";
import { PropertyModule } from "./property.module";

@Module({
    imports:[
        PropertyModule,
        UserPropertyInvoiceModule,
        AuthModule,
        TypeOrmModule.forFeature([UserPropertyPurchase,Office,PropertyPost,Region,City,Residential,Property]),
    ],
    controllers:[PropertyReservationController],
    providers:[
        FindUserProeprtyReservationsUseCase,
        FindUserProeprtyReservationsWithFiltersUseCase,
        FindUserProeprtyReservationWithDetailsUseCase,
        FindPropertyReservationDetails,
        {
            provide:PROPERTY_RESERVATION_REPOSITORY,
            useClass:PropertyReservationRepository
        }
    ],
    exports:[
        PROPERTY_RESERVATION_REPOSITORY
    ],
})
export class PropertyReservationModule{}