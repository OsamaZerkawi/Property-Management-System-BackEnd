import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { City } from "src/domain/entities/city.entity";
import { CityRepositoryInterface } from "src/domain/repositories/city.repository";
import { Repository } from "typeorm";

@Injectable()
export class CityRepository implements CityRepositoryInterface {
    constructor(
        @InjectRepository(City)
        private readonly cityRepo: Repository<City>,
    ){}
    
    async findByName(name: string) {
        return await this.cityRepo.findOne({
            where: {
                name
            }
        });
    }

    async getAllCities() {
        return await this.cityRepo.find({
            select: ['id','name'],
            order: { name: 'ASC' },
        });
    }
}