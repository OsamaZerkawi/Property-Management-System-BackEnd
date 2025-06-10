import { Inject, InternalServerErrorException } from "@nestjs/common";
import { UpdateResidentialPropertyDto } from "src/application/dtos/property/updateResidentialProperty.dto";
import { FindOneResidentialPropertyUseCase } from "./find-one-residential-property.use-case";
import { FindRegionUseCase } from "../region/find-region-by-id.use-case";
import { UpdatePropertyDto } from "src/application/dtos/property/UpdateProperty.dto";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";
import { UpdatePropertyPostDto } from "src/application/dtos/property/UpdatePropertyPost.dto";
import { UpdatePropertyPostUseCase } from "../property-post/update-propety-post.use-case";
import { FindTagsUseCase } from "../tag/find-tags.use-case";
import { AttachTagsToPostUseCase } from "../property-post/attach-tags-to-post.use-case";
import { UpdateResidentialPropertyDetailsDto } from "src/application/dtos/property/UpdateResidentialPropertyDetails.dto";
import { UpdateResidentialPropertyUseCase } from "./update-residential-property.use-case";
import { ResidentialPropertyAccessService } from "src/application/services/residentialPropertyAccess.service";

export class UpdateResidentialPropertyDetailsUseCase{
    constructor(
        private readonly findOneResidentialPropertyUseCase: FindOneResidentialPropertyUseCase,
        private readonly findRegionUseCase: FindRegionUseCase,
        private readonly updatePropertyPostUseCase: UpdatePropertyPostUseCase,
        private readonly findTagsUseCase: FindTagsUseCase,
        private readonly attachTagsToPostUseCase: AttachTagsToPostUseCase,
        private readonly updateResidentialPropertyUseCase: UpdateResidentialPropertyUseCase,
        private readonly residentialPropertyAccessService: ResidentialPropertyAccessService,
        @Inject (PROPERTY_REPOSITORY)
        private readonly propertyRepo: PropertyRepositoryInterface,
    ){}

    async execute(userId: number,residentialpropertyId: number,data: UpdateResidentialPropertyDto,imageName?: string){
        let region;
        if(data.regionId){
            region = await this.findRegionUseCase.execute(data.regionId);
        }

        const residentialProperty = await this.findOneResidentialPropertyUseCase.execute(residentialpropertyId);

        await this.residentialPropertyAccessService.assertUserOwnsResidentialProperty(userId,residentialProperty);

        const propertyDto: UpdatePropertyDto = {
            ...(region && { region }),// only adds region if truthy (defined)
            floor_number:data.floor_number,
            latitude:data.latitude,
            longitude:data.longitude,
            area:data.area,
            has_furniture:data.has_furniture,
            room_details:data.room_details
        }

        const propertyId = residentialProperty.property.id;

        const property = await this.propertyRepo.updateProperty(propertyId,propertyDto);

        const propertyPostDto: UpdatePropertyPostDto = {
            ...(imageName && { postImage: imageName }),// only adds region if truthy (defined)
            postTitle: data.postTitle
        }


        const propertyPost = await this.updatePropertyPostUseCase.execute(property.post.id,propertyPostDto);

        if(data.tags){
           const tags = await this.findTagsUseCase.execute(data.tags)

            await this.attachTagsToPostUseCase.execute(propertyPost,tags);
        }

        const residentialPropertyDto: UpdateResidentialPropertyDetailsDto = {
          listingType: data.listing_type,
          ownership_type: data.ownership_type,
          direction: data.direction,
          rent_details: data.rent_details,
          sell_details: data.sell_details,
        };

        return await this.updateResidentialPropertyUseCase.execute(residentialpropertyId,residentialPropertyDto);
    }
}