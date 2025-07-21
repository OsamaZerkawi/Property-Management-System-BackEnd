import { InjectRepository } from "@nestjs/typeorm";
import { AdminCity } from "src/domain/entities/admin-city.entity";
import { AdminCityRepositoryInterface } from "src/domain/repositories/admin-city.repository";
import { Repository } from "typeorm";

export class AdminCityRepository implements AdminCityRepositoryInterface  {
    constructor(
        @InjectRepository(AdminCity)
        private readonly adminCityRepo: Repository<AdminCity>,
    ){}

    async findCityIdByUserId(userId: number) {
        const adminCity = await this.adminCityRepo.findOne({
            where: {user_id: userId},
            select: ['city_id'],
        });

        return adminCity ? adminCity.city_id : null;
    }
}