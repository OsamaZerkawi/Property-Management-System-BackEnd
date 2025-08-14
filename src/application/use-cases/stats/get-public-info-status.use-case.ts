import { Inject, Injectable } from "@nestjs/common";
import { privateDecrypt } from "crypto";
import { STATS_REPOSITORY, StatsRepositoryInterface } from "src/domain/repositories/stats.repository";

@Injectable()
export class GetPublicInfoStatsUseCase {
    constructor(
        @Inject(STATS_REPOSITORY)
        private readonly statsRepo: StatsRepositoryInterface,
    ){}

    async execute(){
        return await this.statsRepo.getPublicInfo();
    }
}