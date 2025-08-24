import { Inject, NotFoundException } from "@nestjs/common";
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from "src/domain/repositories/office.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

export class GetCommissionOfOfficeMobileUseCase {
    constructor(
        @Inject(OFFICE_REPOSITORY)
        private readonly officeRepo: OfficeRepositoryInterface,
    ){}

    async execute(officeId: number){

        const office =  await this.officeRepo.findById(officeId);

        if(!office){
            throw new NotFoundException(
                errorResponse('لا يوجد مكتب عقاري خاص بك ',404)
            );
        }

        return {
            commission: Number(office.commission)??0.00,
            deposit_per_m2:Number(office.deposit_per_m2)??0.00

        };
    }
}