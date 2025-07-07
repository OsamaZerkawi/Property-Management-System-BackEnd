import { Controller, Get, HttpCode, HttpStatus, Param, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { PropertyReservationFiltersDto } from "src/application/dtos/user-property-reservation/PropertyReservationFilters.dto";
import { FindPropertyReservationDetails } from "src/application/use-cases/user-property-reservation/find-property-reservation-details.use-case";
import { FindUserProeprtyReservationWithDetailsUseCase } from "src/application/use-cases/user-property-reservation/find-user-property-reservation-with-details.use-case";
import { FindUserProeprtyReservationsWithFiltersUseCase } from "src/application/use-cases/user-property-reservation/find-user-property-reservation-with-filters.use-case";
import { FindUserProeprtyReservationsUseCase } from "src/application/use-cases/user-property-reservation/find-user-property-reservation.use-case";
import { Roles } from "src/shared/decorators/role.decorator";
import { successResponse } from "src/shared/helpers/response.helper";
import { GetUserPropertyReservationsSwaggerDoc } from "../swagger/property-reservation/get-all-for-office.swagger";
import { GetUserPropertyReservationsWithFiltersSwaggerDoc } from "../swagger/property-reservation/get-all-for-office-with-filter.swagger";
import { GetPropertyReservationWithDetailsSwaggerDoc } from "../swagger/property-reservation/get-one-for-office.swagger";
import { GetPropertyReservationDetailsSwaggerDoc } from "../swagger/property-reservation/get-details-of-reservation-info.swagger";

@Controller('property-reservation')
export class PropertyReservationController {
    constructor(
        private readonly findUserProeprtyReservationsUseCase: FindUserProeprtyReservationsUseCase,
        private readonly findUserProeprtyReservationsWithFiltersUseCase: FindUserProeprtyReservationsWithFiltersUseCase,
        private readonly findUserProeprtyReservationWithDetailsUseCase: FindUserProeprtyReservationWithDetailsUseCase,
        private readonly findPropertyReservationDetails: FindPropertyReservationDetails,
    ){}
    
    @Roles('صاحب مكتب')
    @GetUserPropertyReservationsSwaggerDoc()
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAll(
        @Req() request: Request
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;
        
        const data =  await this.findUserProeprtyReservationsUseCase.execute(baseUrl);

        return successResponse(data,'تم إرجاع جميع السجلات الخاصة بحجز الأملاك',200);
    }

    @Roles('صاحب مكتب')
    @GetUserPropertyReservationsWithFiltersSwaggerDoc()
    @Get('/filters')
    @HttpCode(HttpStatus.OK)
    async getAllWithFilters(
        @Query() filters: PropertyReservationFiltersDto,
        @Req() request: Request
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const data = await this.findUserProeprtyReservationsWithFiltersUseCase.execute(baseUrl,filters);

        return successResponse(data,'تم إرجاع جميع السجلات الخاصة بحجز الأملاك مفلترة',200)
    }

    @Roles('صاحب مكتب')
    @Get(':propertyReservationId')
    @GetPropertyReservationWithDetailsSwaggerDoc()
    @HttpCode(HttpStatus.OK)
    async getUserPropertyReservationWithDetails(
        @Param('propertyReservationId') propertyReservationId: number,
        @Req() request: Request,
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        const data = await this.findUserProeprtyReservationWithDetailsUseCase.execute(propertyReservationId,baseUrl);

        return successResponse(data,'تم ارجاع سجل حجز الاملاك مع السجلات المالية الخاصة به',200);
    }

    @Roles('صاحب مكتب')
    @Get('/properties/:propertyId')
    @GetPropertyReservationDetailsSwaggerDoc()
    @HttpCode(HttpStatus.OK)
    async getPropetyReservationDetails(
        @Param('propertyId') propertyId: number
    ){
        const data = await this.findPropertyReservationDetails.execute(propertyId);

        return successResponse(data,'تم ارجاع معلومات أجار العقار بنجاح',200);
    }
}