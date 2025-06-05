import { InjectRepository } from "@nestjs/typeorm";
import { Office } from "src/domain/entities/offices.entity";
import { OfficeRepositoryInterface } from "src/domain/repositories/office.repository";
import { Repository } from "typeorm";

export class OfficeRepository implements OfficeRepositoryInterface { 
    constructor(
        @InjectRepository(Office)
        private readonly officeRepo: Repository<Office>
    ){}

    async findOneByUserId (userId: number) {
        return await this.officeRepo.findOne({
            where: {user: {id : userId}}
        });
    }
}