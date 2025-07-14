import { InjectRepository } from "@nestjs/typeorm";
import { City } from "src/domain/entities/city.entity";
import { Region } from "src/domain/entities/region.entity";
import { DataSource, Repository } from "typeorm";
import { SyrianGovernorates } from "../seed-data/syrian-governorates";

interface RegionData {
  name: string;
  default_meter_price: number;
}

interface CityData {
  name: string;
  regions: RegionData[];
}

export class CityRegionSeeder {
    constructor(
        private readonly cityRepo: Repository<City>,
        private readonly regionRepo: Repository<Region>,
        private readonly dataSource: DataSource,
    ){}

    private readonly data: CityData[] = SyrianGovernorates;

    async seed(){
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        // تنفيذ TRUNCATE مع CASCADE لجميع الجداول المرتبطة
        await queryRunner.query('TRUNCATE TABLE regions RESTART IDENTITY CASCADE');
        await queryRunner.query('TRUNCATE TABLE cities RESTART IDENTITY CASCADE');

        await queryRunner.release();

        for (const cityData of this.data) {
          const city = this.cityRepo.create({ name: cityData.name });
          city.regions = cityData.regions.map(regionData =>
            this.regionRepo.create({
              name: regionData.name,
              default_meter_price: regionData.default_meter_price,
            }),
          );
          await this.cityRepo.save(city);
        }
    
      console.log('✅ Successfully seeded cities and regions with default meter prices!');

    }
}