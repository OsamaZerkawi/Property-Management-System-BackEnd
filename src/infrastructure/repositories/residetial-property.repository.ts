import { InjectRepository } from "@nestjs/typeorm";
import { ResidentialPropertyDto } from "src/application/dtos/property/ResidentialProperty.dto";
import { Residential } from "src/domain/entities/residential.entity";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { ResidentialPropertyRepositoryInterface } from "src/domain/repositories/residential-property.repository";
import { Repository } from "typeorm";

export class ResidentialPropertyRepository implements ResidentialPropertyRepositoryInterface{
    constructor(
        @InjectRepository(Residential)
        private readonly residentialRepo: Repository<Residential>
    ){}
    async createResidentialPropertyAndSaveIt(data: ResidentialPropertyDto) {
       const { property, ownership_type, direction, listingType, rent_details, sell_details } = data;
       
       const baseData = { property, ownership_type, direction, listing_type: listingType };

        const listingData =
          listingType === ListingType.RENT
            ? {
                monthly_price: rent_details?.monthly_price,
                rental_period: rent_details?.rental_period,
              }
            : {
                selling_price: sell_details?.selling_price,
                installment_allowed: sell_details?.installment_allowed,
                installment_duration: sell_details?.installment_duration,
              };
      
        const residential = this.residentialRepo.create({ ...baseData, ...listingData });
        return await this.residentialRepo.save(residential);
    }
}