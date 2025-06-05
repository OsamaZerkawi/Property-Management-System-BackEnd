import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

@Injectable()
export class PropertyAccessService {
    constructor(
        @Inject(PROPERTY_REPOSITORY)
        private readonly propertyRepo: PropertyRepositoryInterface,
    ){}

    async verifyUserIsOwner(propertyId: number,userId: number){
        const property = await this.propertyRepo.findByIdWithOwner(propertyId);

        if (!property) {
           throw new NotFoundException(
            errorResponse('العقار غير موجود',404)
           );
        }
    
        if (property.office.user.id !== userId) {
          throw new ForbiddenException(
            errorResponse('ليس لديك صلاحية للوصول لهذا العقار',403)
          );
        }
    }
}