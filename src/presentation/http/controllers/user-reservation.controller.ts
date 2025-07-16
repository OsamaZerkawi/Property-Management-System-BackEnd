import { BadRequestException, Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, ParseIntPipe, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { FindAllOwnReservationsUseCase } from "src/application/use-cases/user-property-reservation/find-all-own-reservation.use-case";
import { PropertyType } from "src/domain/enums/property-type.enum";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { errorResponse, successPaginatedResponse } from "src/shared/helpers/response.helper";
import { GetOwnReservationsSwaggerDoc } from "../swagger/user-reservation/get-own-reservation.swagger";

@Controller('user-reservation')
export class UserReservationController{
    constructor(
        private readonly findAllOwnReservationsUseCase: FindAllOwnReservationsUseCase,
    ){}

    @Get('own') 
    @GetOwnReservationsSwaggerDoc()
    @HttpCode(HttpStatus.OK)
    async getOwnReservations(
        @CurrentUser() user,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('items', new DefaultValuePipe(10), ParseIntPipe) items: number,
        @Query('type') type: PropertyType,
        @Req() request: Request
    ){
        const baseUrl = `${request.protocol}://${request.get('host')}`;
        const userId = user.sub;

          if (!type || (type !== PropertyType.RESIDENTIAL && type !== PropertyType.TOURISTIC)) {
            throw new BadRequestException(
                errorResponse('يجب تحديد نوع العقار (سكني أو سياحي)', 400)
            );
          }

        const {data,total} = await this.findAllOwnReservationsUseCase.execute(userId,type,baseUrl,page,items);

        return successPaginatedResponse(data,total,page,items,'تم جلب جميل الحجوزات الخاصة بك',200);
    }
}