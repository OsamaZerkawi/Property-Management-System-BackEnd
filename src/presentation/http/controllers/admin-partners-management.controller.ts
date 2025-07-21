import { Controller, Get, HttpCode, HttpStatus, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { raceWith } from "rxjs";
import { GetOfficesByAdminCityUseCase } from "src/application/use-cases/office/get-offices-by-admin-city.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { successResponse } from "src/shared/helpers/response.helper";

@ApiTags('Admin - Partners Management')
@Controller('admin/partners-management')    
export class AdminPartnersManagementController {
    constructor(
        private readonly getOfficesByAdminCityUseCase: GetOfficesByAdminCityUseCase,
    ){}

   @Get('offices')
   @HttpCode(HttpStatus.OK)
   async getOffices(
    @Req() request: Request,
    @CurrentUser() user,
   ){
      const baseUrl = `${request.protocol}://${request.get('host')}`;
      const adminId = user.sub;
      const data = await this.getOfficesByAdminCityUseCase.execute(adminId,baseUrl);
  
      return successResponse(data,'تم إرجاع جميع المكاتب بنجاح',200);

   } 
}
