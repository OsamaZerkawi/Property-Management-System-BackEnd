import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ResidentialPropertyDto } from "src/application/dtos/property/ResidentialProperty.dto";
import { UpdateResidentialPropertyDetailsDto } from "src/application/dtos/property/UpdateResidentialPropertyDetails.dto";
import { Residential } from "src/domain/entities/residential.entity";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { ResidentialPropertyRepositoryInterface } from "src/domain/repositories/residential-property.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
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

  async findById(id: any) {
    return await this.residentialRepo.findOne({
    where: { id },
    relations: {
      property: {
        region: {
          city: true,
        },
        office: true,
        post: {
          propertyPostTags: {
            tag: true,
          },
        },
      },
    },
  });
  }

  async updateResidentialProperty(id: number, data: UpdateResidentialPropertyDetailsDto) {
      const residentialProperty = await this.residentialRepo.findOne({where: {id}});

      if(!residentialProperty){
        throw new NotFoundException(
          errorResponse('لا يوجد عقار سكني بهذا المعرف ',404)
        );
      }

      const hasValidData = Object.values(data).some(value => value !== undefined && value !== null);
      
      if(!hasValidData){
        return residentialProperty;
      }

      await this.residentialRepo
      .createQueryBuilder()
      .update(Residential)
      .set(data)
      .where("id = :id", { id })
      .execute();

      const updatedResidentialProperty = await this.residentialRepo
      .createQueryBuilder("residential")
      .where("residential.id = :id", { id })
      .getOne();

      return updatedResidentialProperty;
  }
}