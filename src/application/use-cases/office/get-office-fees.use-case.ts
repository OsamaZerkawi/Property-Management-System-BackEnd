import { Inject } from "@nestjs/common";
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from "src/domain/repositories/office.repository";

export class GetOfficeFeesUseCase {
    constructor(
        @Inject(OFFICE_REPOSITORY)
        private readonly officeRepo: OfficeRepositoryInterface,
    ){}

    async execute(userId: number){
        return await this.officeRepo.getOfficeFees(userId);
    }
}