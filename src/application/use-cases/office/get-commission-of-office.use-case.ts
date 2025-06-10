import { Inject, NotFoundException } from "@nestjs/common";
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from "src/domain/repositories/office.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

export class GetCommissionOfOfficeUseCase {
    constructor(
        @Inject(OFFICE_REPOSITORY)
        private readonly officeRepo: OfficeRepositoryInterface,
    ){}

    async execute(userId: number){

        const office =  await this.officeRepo.findOneByUserId(userId);

        if(!office){
            throw new NotFoundException(
                errorResponse('لا يوجد مكتب عقاري خاص بك ',404)
            );
        }

        return {
            commission: office.commission
        };
    }
}