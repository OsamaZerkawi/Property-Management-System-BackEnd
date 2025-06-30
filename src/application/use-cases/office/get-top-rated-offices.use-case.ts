import { Inject } from "@nestjs/common";
import { OFFICE_REPOSITORY, OfficeRepositoryInterface } from "src/domain/repositories/office.repository";

export class GetTopRatedOfficesUseCase{
    constructor(
        @Inject(OFFICE_REPOSITORY)
        private readonly officeRepo: OfficeRepositoryInterface,
    ){}

    async execute(page: number,items: number,baseUrl: string){
        return await this.officeRepo.findTopRatedOffices(page,items,baseUrl);
    }
}