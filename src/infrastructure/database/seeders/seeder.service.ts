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
import { ServiceProviderSeeder } from "./service-provider.seeder";
import { PromotedPropertySeeder } from "./promoted-properties.seeder";
import { UserPostSeeder } from "./user-post.seeder";
import { OfficeFeedbackSeeder } from "./office-feedback.seeder";
import { ServiceFeedbackSeeder } from "./service-provider-feedback.seeder";
import { PropertyFavoriteSeeder } from "./favorite.seeder";
import { Advertisement } from "src/domain/entities/advertisements.entity";
import { AdvertisementSeeder } from "./advertisement.seeder";
import { JoinRequestSeeder } from "./join-requests.seeder";
import { SocialPlatformSeeder } from "./social-platform.seeder";

@Injectable()
export class SeederService {
  constructor(
    private readonly permissionSeeder: PermissionSeeder,
    private readonly roleSeeder: RoleSeeder,
    private readonly officePropertySeeder: OfficePropertySeeder,
    private readonly propertyFeedbackSeeder: PropertyFeedbackSeeder,
    private readonly touristicPropertySeeder: TouristicPropertySeeder,
    private readonly serviceProviderSeeder: ServiceProviderSeeder,
    private readonly promotedPropertySeeder: PromotedPropertySeeder,
    private readonly userPostSeeder: UserPostSeeder,
    private readonly servicePriceSeeder: ServicePriceSeeder,
    private readonly officeFeedbackSeeder: OfficeFeedbackSeeder,
    private readonly serviceFeedbackSeeder: ServiceFeedbackSeeder,
    private readonly propertyFavoriteSeeder: PropertyFavoriteSeeder,
    private readonly advertisementSeeder: AdvertisementSeeder,
    private readonly joinRequestSeeder: JoinRequestSeeder,
    private readonly socialPlatformSeeder: SocialPlatformSeeder,
    
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

    await this.socialPlatformSeeder.seed();
    
    await this.servicePriceSeeder.seed();

    // 2. Seed permissions and roles
    await this.permissionSeeder.seed();
    await this.roleSeeder.seed();

    // 3. Seed offices, properties, posts, residentials
    await this.officePropertySeeder.seed();

    // 4.seed touristic properties
    await this.touristicPropertySeeder.seed();

    // 5. Seed property feedback (ratings)
    await this.propertyFeedbackSeeder.seed();

    // 6. Seed Promoted properties 
    await this.promotedPropertySeeder.seed();

    // 7. Seed user posts
    await this.userPostSeeder.seed();

    // 8.Seed Service Providers 
    await this.serviceProviderSeeder.seed();

    await this.serviceFeedbackSeeder.seed();

    await this.officeFeedbackSeeder.seed();

    await this.propertyFavoriteSeeder.seed();
    
    await this.joinRequestSeeder.seed();
    
    await this.advertisementSeeder.seed();
    console.log('✅ All seeders executed successfully.');
  }
}