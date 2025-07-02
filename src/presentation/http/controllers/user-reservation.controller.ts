import { Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, ParseIntPipe, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { FindAllOwnReservationsUseCase } from "src/application/use-cases/user-property-reservation/find-all-own-reservation.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { successPaginatedResponse } from "src/shared/helpers/response.helper";

@Controller('user-reservation')
export class UserReservationController{
    constructor(
        private readonly findAllOwnReservationsUseCase: FindAllOwnReservationsUseCase,
    ){}

    @Get('own') 
    @HttpCode(HttpStatus.OK)
    async getOwnReservations(
        @CurrentUser() user,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('items', new DefaultValuePipe(10), ParseIntPipe) items: number,
        @Req() request: Request
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;
        const userId = user.sub;

        const {data,total} = await this.findAllOwnReservationsUseCase.execute(userId,baseUrl,page,items);

        return successPaginatedResponse(data,total,page,items,'تم جلب جميل الحجوزات الخاصة بك',200);
    }
}