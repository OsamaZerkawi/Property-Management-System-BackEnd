import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { City } from "src/domain/entities/city.entity";
import { Region } from "src/domain/entities/region.entity";
import { DataSource, Repository } from "typeorm";
import { CityRegionSeeder } from "./city-region.seeder";
import { PermissionSeeder } from "./permission.seeder";
import { RoleSeeder } from "./role.seeder";
import { OfficePropertySeeder } from "./office-property.seeder";
import { PropertyFeedbackSeeder } from "./property-feedback.seeder";
import { ServicePriceSeeder } from "./service-price.seeder";
import { TouristicPropertySeeder } from "./touristic-property.seeder";

@Injectable()
export class SeederService {
  constructor(
    private readonly permissionSeeder: PermissionSeeder,
    private readonly roleSeeder: RoleSeeder,
    private readonly officePropertySeeder: OfficePropertySeeder,
    private readonly propertyFeedbackSeeder: PropertyFeedbackSeeder,
    private readonly touristicPropertySeeder: TouristicPropertySeeder,
    private readonly servicePriceSeeder: ServicePriceSeeder,
    
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
    @InjectRepository(Region)
    private readonly regionRepo: Repository<Region>,
    private readonly dataSource: DataSource,
  ){}
  async run(){
    // 1. Seed cities and regions
    const cityRegionSeeder = new CityRegionSeeder(this.cityRepo, this.regionRepo, this.dataSource);
    await cityRegionSeeder.seed();

    // 2. Seed permissions and roles
    await this.permissionSeeder.seed();
    await this.roleSeeder.seed();

    // 3. Seed offices, properties, posts, residentials
    await this.officePropertySeeder.seed();

    // 4.seed touristic properties
    await this.touristicPropertySeeder.seed();

    // 5. Seed property feedback (ratings)
    await this.propertyFeedbackSeeder.seed();
    // await this.servicePriceSeeder.seed();
    console.log('✅ All seeders executed successfully.');
  }
}