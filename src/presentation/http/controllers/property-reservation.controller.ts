import { Controller, Get, HttpCode, HttpStatus, Param, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { PropertyReservationFiltersDto } from "src/application/dtos/user-property-reservation/PropertyReservationFilters.dto";
import { FindPropertyReservationDetails } from "src/application/use-cases/user-property-reservation/find-property-reservation-details.use-case";
import { FindUserProeprtyReservationWithDetailsUseCase } from "src/application/use-cases/user-property-reservation/find-user-property-reservation-with-details.use-case";
import { FindUserProeprtyReservationsWithFiltersUseCase } from "src/application/use-cases/user-property-reservation/find-user-property-reservation-with-filters.use-case";
import { FindUserProeprtyReservationsUseCase } from "src/application/use-cases/user-property-reservation/find-user-property-reservation.use-case";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('property-reservation')
export class PropertyReservationController {
    constructor(
        private readonly findUserProeprtyReservationsUseCase: FindUserProeprtyReservationsUseCase,
        private readonly findUserProeprtyReservationsWithFiltersUseCase: FindUserProeprtyReservationsWithFiltersUseCase,
        private readonly findUserProeprtyReservationWithDetailsUseCase: FindUserProeprtyReservationWithDetailsUseCase,
        private readonly findPropertyReservationDetails: FindPropertyReservationDetails,
    ){}

    @Get()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getAll(
        @Req() request: Request
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;
        
        const data =  await this.findUserProeprtyReservationsUseCase.execute(baseUrl);

        return successResponse(data,'تم إرجاع جميع السجلات الخاصة بحجز الأملاك',200);
    }

    @Get('/filters')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getAllWithFilters(
        @Query() filters: PropertyReservationFiltersDto,
        @Req() request: Request
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const data = await this.findUserProeprtyReservationsWithFiltersUseCase.execute(baseUrl,filters);

        return successResponse(data,'تم إرجاع جميع السجلات الخاصة بحجز الأملاك مفلترة',200)
    }

    @Get(':propertyReservationId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getUserPropertyReservationWithDetails(
        @Param('propertyReservationId') propertyReservationId: number,
        @Req() request: Request,
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const data = await this.findUserProeprtyReservationWithDetailsUseCase.execute(propertyReservationId,baseUrl);

        return successResponse(data,'تم ارجاع سجل حجز الاملاك مع السجلات المالية الخاصة به',200);
    }

    @Get('/properties/:propertyId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getPropetyReservationDetails(
        @Param('propertyId') propertyId: number
    ){
        const data = await this.findPropertyReservationDetails.execute(propertyId);

        return successResponse(data,'تم ارجاع معلومات أجار العقار بنجاح',200);
    }
}