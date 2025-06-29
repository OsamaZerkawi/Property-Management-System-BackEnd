import { Inject } from "@nestjs/common";
import { UpdateOfficeFeesDto } from "src/application/dtos/office/Update-office-fees.dto";
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from "src/domain/repositories/office.repository";

export class UpdateOfficeFeesUseCase {
    constructor(
        @Inject(OFFICE_REPOSITORY)
        private readonly officeRepo: OfficeRepositoryInterface,
    ){}

    async execute(userId: number,data: UpdateOfficeFeesDto){
        return await this.officeRepo.updateOfficeFees(userId,data);
    }
}