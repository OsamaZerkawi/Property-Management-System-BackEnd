import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { City } from "src/domain/entities/city.entity";
import { Region } from "src/domain/entities/region.entity";
import { DataSource, Repository } from "typeorm";
import { CityRegionSeeder } from "./city-region.seeder";
import { PermissionSeeder } from "./permission.seeder";
import { RoleSeeder } from "./role.seeder";

@Injectable()
export class SeederService {
    constructor(
        private readonly permissionSeeder: PermissionSeeder,
        private readonly roleSeeder: RoleSeeder,
        @InjectRepository(City)
        private readonly cityRepo: Repository<City>,
        @InjectRepository(Region)
        private readonly regionRepo: Repository<Region>,
        private readonly dataSource: DataSource,
    ){}

    async run(){
        const seeder = new CityRegionSeeder(this.cityRepo,this.regionRepo,this.dataSource);
        await seeder.seed();

        await this.permissionSeeder.seed();
        await this.roleSeeder.seed();
    }
}