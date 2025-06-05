import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { GetAllCitiesUseCase } from "src/application/use-cases/city/get-cities.use-case";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('city')
export class CityController {
    constructor(
        private readonly getAllCitiesUseCase : GetAllCitiesUseCase,
    ){}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAll(){
        const cities =  await this.getAllCitiesUseCase.execute();

        return successResponse(cities,'تم ارجاع المحافظات بنجاح',200);
    }
}