import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "src/domain/entities/tag.entity";
import { TagRepositoryInterface } from "src/domain/repositories/tag.repository";
import { In, Repository } from "typeorm";

@Injectable()
export class TagRepository implements TagRepositoryInterface{
    constructor(
        @InjectRepository(Tag)
        private readonly tageRepo: Repository<Tag>
    ){}
    
    async getAllTags() {
        return await this.tageRepo.find({
            select:['id','name'],
            order: {
               name: 'ASC', 
            },
        });
    }

    async findTagsByIds(tags: number[]) {
       return await this.tageRepo.find({
        where: {
            id: In(tags)
        }
       });
    }
}