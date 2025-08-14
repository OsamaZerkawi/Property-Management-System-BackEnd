import { Inject, Injectable } from '@nestjs/common';
import { StatsType } from 'src/domain/enums/stats-type.enum';
import {
  STATS_REPOSITORY,
  StatsRepositoryInterface,
} from 'src/domain/repositories/stats.repository';

@Injectable()
export class GetPopularStatsUseCase {
  constructor(
    @Inject(STATS_REPOSITORY)
    private readonly statsRepo: StatsRepositoryInterface,
  ) {}

  async execute(baseUrl: string, type: StatsType) {
    if (type === StatsType.OFFICE) {
      const topOffices = await this.statsRepo.getTopFiveOffices();
      return topOffices.map((item) => ({
        id: item.id,
        name: item.name,
        logo: item.logo
          ? `${baseUrl}/uploads/offices/logos/${item.logo}`
          : null,
        type: item.type,
        location: item.location,
        rate: parseFloat(item.avg_rate).toFixed(1),
        rating_count: parseInt(item.rating_count),
      }));
    }
    if (type === StatsType.SERVICE_PROVIDER) {
      const topProviders = await this.statsRepo.getTopFiveServiceProviders();
      return topProviders.map((item) => ({
        id: item.id,
        name: item.name,
        logo: item.logo
          ? `${baseUrl}/uploads/service-providers/logos/${item.logo}`
          : null,
        career: item.career,
        location: item.location,
        rate: parseFloat(item.avg_rate),
        rating_count: parseInt(item.rating_count),
      }));
    }
  }
}
