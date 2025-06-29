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
        const regions =  await this.regionRepo
        .createQueryBuilder('region')
        .leftJoin('region.city','city')
        .where('city.id = :cityId',{cityId})
        .select([
            'region.id',
            'region.name',
            'region.default_meter_price'
        ])
        .getMany();

        const result = regions.map(region => ({
          id: region.id,
          name: region.name,
          default_meter_price: parseFloat(region.default_meter_price),
        }));        

        return result;
    }

    async getExpectedpPrice(regionId: number) {
        return await this.regionRepo.findOne({
            where: {id: regionId},
            select:['id','name','default_meter_price']
        });
    }

}