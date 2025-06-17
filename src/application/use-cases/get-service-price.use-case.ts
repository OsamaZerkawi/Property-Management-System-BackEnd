import { IServicePriceRepository } from 'src/domain/repositories/service-price.repository';

export class GetServicePriceUseCase {
  constructor(private readonly servicePriceRepo: IServicePriceRepository) {}

  async execute(service: string): Promise<number | null> {
    return await this.servicePriceRepo.findPriceByService(service);
  }
}
