import { base } from "@faker-js/faker/.";
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { raceWith } from "rxjs";
import { respondToJoinRequestsDto } from "src/application/dtos/auth/respond-to-join-request.dto";
import { RespondToJoinRequestUseCase } from "src/application/use-cases/join-requests/respond-to-join-requests.use-case";
import { GetOfficesByAdminCityUseCase } from "src/application/use-cases/office/get-offices-by-admin-city.use-case";
import { GetServiceProvidersByAdminCityUseCase } from "src/application/use-cases/service-provider/get-service-provider-by-admin-city.use-case";
import { GetServiceProviderDetailsUseCase } from "src/application/use-cases/service-provider/get-service-provider-details.use-case";
import { Role } from "src/domain/entities/role.entity";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Permissions } from "src/shared/decorators/permission.decorator";
import { Roles } from "src/shared/decorators/role.decorator";
import { successResponse } from "src/shared/helpers/response.helper";
import { GetOfficesSwaggerDoc } from "../swagger/admin-partners-management/get-all-offices.swagger";
import { GetServiceProvidersSwaggerDoc } from "../swagger/admin-partners-management/get-all-service-providers.swagger";
import { GetServiceProviderSwaggerDoc } from "../swagger/admin-partners-management/get-service-provider.swagger";
import { RespondToJoinRequestSwaggerDoc } from "../swagger/admin-partners-management/respond-to-join-request.swagger";

@ApiTags('Admin - Partners Management')
@Controller('admin/partners-management')    
export class AdminPartnersManagementController {
    constructor(
        private readonly getOfficesByAdminCityUseCase: GetOfficesByAdminCityUseCase,
        private readonly getServiceProvidersByAdminCityUseCase: GetServiceProvidersByAdminCityUseCase,
        private readonly getServiceProviderDetailsUseCase: GetServiceProviderDetailsUseCase,
        private readonly respondToJoinRequestUseCase: RespondToJoinRequestUseCase,
    ){}
    
    @Roles('مشرف')
    @Permissions('إدارة الوسطاء')
    @Get('offices')
    @GetOfficesSwaggerDoc()
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
    @Permissions('إدارة الوسطاء')
    @GetServiceProvidersSwaggerDoc()
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
    @Permissions('إدارة الوسطاء')
    @GetServiceProviderSwaggerDoc()
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

    @Roles('مشرف')
    @RespondToJoinRequestSwaggerDoc()
    @Permissions('إدارة الوسطاء')
    @HttpCode(HttpStatus.OK)
    @Post('join-requests/:id/respond')
    async respondToJoinRequest(
        @Param('id') id: number,
        @Body() data: respondToJoinRequestsDto,
    ){
        const message = await this.respondToJoinRequestUseCase.execute(id,data);
        return successResponse([],message,200);
    }
}
