import { ForbiddenException } from "@nestjs/common";
import { Residential } from "src/domain/entities/residential.entity";
import { errorResponse } from "src/shared/helpers/response.helper";

export class ResidentialPropertyAccessService {
    constructor() {}

    async assertUserOwnsResidentialProperty(userId: number,residential:Residential){
        const officeOwnerId = residential.property?.office?.user?.id;
            
        if (!officeOwnerId || officeOwnerId !== userId) {
          throw new ForbiddenException(
            errorResponse('لا تملك الصلاحية لتحديث هذا العقار',403)
          );
        }
    }
}