import { Inject, Injectable } from "@nestjs/common";
import { CITY_REPOSITORY, CityRepositoryInterface } from "src/domain/repositories/city.repository";

@Injectable()
export class GetAllCitiesUseCase {
    constructor(
        @Inject(CITY_REPOSITORY)
        private readonly cityRepo: CityRepositoryInterface
    ){}

    async execute(){
        return await this.cityRepo.getAllCities();
    }
}