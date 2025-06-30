import { BadRequestException, Inject } from "@nestjs/common";
import { ServiceProviderFeedbackDto } from "src/application/dtos/service-provider/service-provider-feedback.dto";
import { SERVICE_PROVIDER_REPOSITORY, ServiceProviderRepositoryInterface } from "src/domain/repositories/service-provider.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

export class CreateOrUpdateServiceProviderFeedbackUseCase {
    constructor(
        @Inject(SERVICE_PROVIDER_REPOSITORY)
        private readonly serviceProviderRepo: ServiceProviderRepositoryInterface, 
    ){}

    async execute(userId: number,servicerProviderId: number,data: ServiceProviderFeedbackDto){
        if(data.complaint === undefined && data.rate === undefined){
            throw new BadRequestException(
                errorResponse('يجب إرسال تقييم أو شكوى على الأقل',400)
            );
        }

        return await this.serviceProviderRepo.createOrUpdateFeedback(userId,servicerProviderId,data);
    }
}