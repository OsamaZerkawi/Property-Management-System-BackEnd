import { ConsoleLogger, Inject, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UpdateResidentialPropertyDto } from "src/application/dtos/property/updateResidentialProperty.dto";
import { FindOneResidentialPropertyUseCase } from "./find-one-residential-property.use-case";
import { FindRegionUseCase } from "../region/find-region-by-id.use-case";
import { UpdatePropertyDto } from "src/application/dtos/property/UpdateProperty.dto";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";
import { UpdatePropertyPostDto } from "src/application/dtos/property/UpdatePropertyPost.dto";
import { UpdatePropertyPostUseCase } from "../property-post/update-propety-post.use-case";
import { AttachTagsToPostUseCase } from "../property-post/attach-tags-to-post.use-case";
import { UpdateResidentialPropertyDetailsDto } from "src/application/dtos/property/UpdateResidentialPropertyDetails.dto";
import { UpdateResidentialPropertyUseCase } from "./update-residential-property.use-case";
import { ResidentialPropertyAccessService } from "src/application/services/residentialPropertyAccess.service";
import { NotFoundError } from "rxjs";
import { errorResponse } from "src/shared/helpers/response.helper";

export class UpdateResidentialPropertyDetailsUseCase{
    constructor(
        private readonly findOneResidentialPropertyUseCase: FindOneResidentialPropertyUseCase,
        private readonly findRegionUseCase: FindRegionUseCase,
        private readonly updatePropertyPostUseCase: UpdatePropertyPostUseCase,
        private readonly updateResidentialPropertyUseCase: UpdateResidentialPropertyUseCase,
        private readonly residentialPropertyAccessService: ResidentialPropertyAccessService,
        @Inject (PROPERTY_REPOSITORY)
        private readonly propertyRepo: PropertyRepositoryInterface,
    ){}

    async execute(userId: number,propertyId: number,data: UpdateResidentialPropertyDto,imageName?: string){
        
        let region;
        if(data.regionId){
            region = await this.findRegionUseCase.execute(data.regionId);
        }

        const propertyData =  await this.propertyRepo.findById(propertyId);

        if(!propertyData){
            throw new NotFoundException(
                errorResponse('العقار غير موجود',404)
            );
        }

        await this.residentialPropertyAccessService.assertUserOwnsResidentialProperty(userId,propertyData);

        const propertyDto: UpdatePropertyDto = {
            ...(region && { region }),// only adds region if truthy (defined)
            floor_number:data.floor_number,
            latitude:data.latitude,
            longitude:data.longitude,
            area:data.area,
            has_furniture:data.has_furniture,
            room_details:data.room_details
        }

        const property = await this.propertyRepo.updateProperty(propertyId,propertyDto);

        const propertyPostDto: UpdatePropertyPostDto = {
            ...(imageName && { postImage: imageName }),// only adds region if truthy (defined)
            postDescription: data.postDescription,
            postTag: data.postTag,
            ...(data.postTag && {postTitle: `${data.postTag} ${property.area.toFixed(2)} م²`}),
        }

        const propertyPost = await this.updatePropertyPostUseCase.execute(property.post.id,propertyPostDto);

        const residentialPropertyDto: UpdateResidentialPropertyDetailsDto = {
          listingType: data.listing_type,
          ownership_type: data.ownership_type,
          direction: data.direction,
          rent_details: data.rent_details,
          sell_details: data.sell_details,
          status: data.status,
        };

        return await this.updateResidentialPropertyUseCase.execute(propertyId,residentialPropertyDto);
    }
}