import { Inject, NotFoundException } from "@nestjs/common";
import { CreatePropertyDto } from "src/application/dtos/property/CreateProperty.dto";
import { CreateResidentialPropertyDto } from "src/application/dtos/property/createResidentialProperty.dto";
import { REGION_REPOSITORY, RegionRepositoryInterface } from "src/domain/repositories/region.repository";
import { CreatePropertyUseCase } from "./create-property.use-case";
import { CreatePropertyPostUseCase } from "../property-post/create-property-post.use-case";
import { CreatePropertyPostDto } from "src/application/dtos/property/CreatePropertyPost.dto";
import { FindTagsUseCase } from "../tag/find-tags.use-case";
import { AttachTagsToPostUseCase } from "../property-post/attach-tags-to-post.use-case";
import { createResidentialPropertyUseCase } from "./create-residential-propety.use-case";
import { ResidentialPropertyDto } from "src/application/dtos/property/ResidentialProperty.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Office } from "src/domain/entities/offices.entity";
import { Repository } from "typeorm";
import { errorResponse } from "src/shared/helpers/response.helper";
import { PropertyType } from "src/domain/enums/property-type.enum";
import { FindRegionUseCase } from "../region/find-region-by-id.use-case";
import { FindOfficeForUserUseCase } from "../office/find-office-for-user.use-case";
export class CreateResidentialPropertyDetailsUseCase {
    constructor(
        private readonly createPropertyUseCase: CreatePropertyUseCase,
        private readonly createPropertyPostUseCase: CreatePropertyPostUseCase,
        private readonly findTagsUseCase: FindTagsUseCase,
        private readonly attachTagsToPostUseCase: AttachTagsToPostUseCase,
        private readonly createResidentialPropertyUseCase: createResidentialPropertyUseCase,
        private readonly findRegionUseCase: FindRegionUseCase,
        private readonly findOfficeForUserUseCase: FindOfficeForUserUseCase,
        @InjectRepository(Office)
        private  readonly officeRepo: Repository<Office>
    ){}

    async execute(data: CreateResidentialPropertyDto,userId: number,imageName: string){
        const region = await this.findRegionUseCase.execute(data.regionId);

        const office = await this.findOfficeForUserUseCase.execute(userId);

        if(!office){
            throw new NotFoundException(
                errorResponse('لا يوجد مكتب عقاري لك ',404)
            );
        }

        const propertyDto:CreatePropertyDto = {
            office,
            region,
            property_type:PropertyType.RESIDENTIAL,
            floor_number:data.floor_number,
            latitude:data.latitude,
            longitude:data.longitude,
            area:data.area,
            has_furniture:data.has_furniture,
            room_details:data.room_details
        };

        const property = await this.createPropertyUseCase.execute(propertyDto);

        const propertyPostDto: CreatePropertyPostDto = {
            property: property,
            postImage: imageName,
            postTitle: data.postTitle
        };

        const propertyPost = await this.createPropertyPostUseCase.execute(propertyPostDto);

        const tags = await this.findTagsUseCase.execute(data.tags);

        await this.attachTagsToPostUseCase.execute(propertyPost,tags);

        const residentialPropertyDto: ResidentialPropertyDto = {
          listingType: data.listing_type,
          property,
          ownership_type: data.ownership_type,
          direction: data.direction,
          rent_details: data.rent_details,
          sell_details: data.sell_details,
        };

        return await this.createResidentialPropertyUseCase.execute(residentialPropertyDto);
    }
}