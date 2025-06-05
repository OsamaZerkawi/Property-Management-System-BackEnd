import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Region } from "src/domain/entities/region.entity";
import { RegionRepositoryInterface } from "src/domain/repositories/region.repository";
import { Repository } from "typeorm";

@Injectable()
export class RegionRepository implements RegionRepositoryInterface {

    constructor(
        @InjectRepository(Region)
        private readonly regionRepo: Repository<Region>,
    ){}

    async findByName(name: string) {
        return await this.regionRepo.findOne({
            where: {
                name
            }
        });
    }

    async findById(regionId: number) {
        return await this.regionRepo.findOne({
            where: {id: regionId}
        });
    }

    async getRegionsByCityId(cityId: any) {
        return await this.regionRepo.find({
            where: {
                city : {id : cityId},
            },
            select: ['id','name'],
            order: { name: 'ASC' },
        });
    }
}