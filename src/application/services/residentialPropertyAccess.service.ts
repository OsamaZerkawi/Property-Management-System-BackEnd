import { ForbiddenException } from "@nestjs/common";
import { Property } from "src/domain/entities/property.entity";
import { Residential } from "src/domain/entities/residential.entity";
import { errorResponse } from "src/shared/helpers/response.helper";

export class ResidentialPropertyAccessService {
    constructor() {}

    async assertUserOwnsResidentialProperty(userId: number,property: Property){
      const officeOwnerId = property?.office?.user?.id;

      if (!officeOwnerId || officeOwnerId !== userId) {
        throw new ForbiddenException(
          errorResponse('لا تملك الصلاحية لتحديث هذا العقار',403)
        );
      }
    }
}