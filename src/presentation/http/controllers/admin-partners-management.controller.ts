import { base } from "@faker-js/faker/.";
import { Controller, Get, HttpCode, HttpStatus, Param, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { raceWith } from "rxjs";
import { GetOfficesByAdminCityUseCase } from "src/application/use-cases/office/get-offices-by-admin-city.use-case";
import { GetServiceProvidersByAdminCityUseCase } from "src/application/use-cases/service-provider/get-service-provider-by-admin-city.use-case";
import { GetServiceProviderDetailsUseCase } from "src/application/use-cases/service-provider/get-service-provider-details.use-case";
import { Role } from "src/domain/entities/role.entity";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Permissions } from "src/shared/decorators/permission.decorator";
import { Roles } from "src/shared/decorators/role.decorator";
import { successResponse } from "src/shared/helpers/response.helper";

@ApiTags('Admin - Partners Management')
@Controller('admin/partners-management')    
export class AdminPartnersManagementController {
    constructor(
        private readonly getOfficesByAdminCityUseCase: GetOfficesByAdminCityUseCase,
        private readonly getServiceProvidersByAdminCityUseCase: GetServiceProvidersByAdminCityUseCase,
        private readonly getServiceProviderDetailsUseCase: GetServiceProviderDetailsUseCase,
    ){}
    
    @Roles('مشرف')
    @Permissions('إدارة المكاتب ومزودي الخدمات')
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

    @Roles('مشرف')
    @Permissions('إدارة المكاتب ومزودي الخدمات')
    @Get('service-providers')
    @HttpCode(HttpStatus.OK)
    async getServiceProviders(
        @Req() request: Request,
        @CurrentUser() user,
    ){
       const baseUrl = `${request.protocol}://${request.get('host')}`;

        const adminId = user.sub;

        const data = await this.getServiceProvidersByAdminCityUseCase.execute(adminId,baseUrl);

        return successResponse(data,'تم إرجاع جميع مزودي الخدمات بنجاح',200);
    }

    @Roles('مشرف')
    @Permissions('إدارة المكاتب ومزودي الخدمات')
    @Get('service-providers/:id')
    @HttpCode(HttpStatus.OK)    
    async getServiceProvider(
        @Param('id') id: number,
        @Req() request: Request,
    ){
       const baseUrl = `${request.protocol}://${request.get('host')}`;
        
       const data = await this.getServiceProviderDetailsUseCase.execute(id,baseUrl);

       return successResponse(data,'تم إرجاع تفاصيل مزود الخدمة بنجاح',200);
    }

}
