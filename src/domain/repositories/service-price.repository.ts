export interface IServicePriceRepository {
    findPriceByService(service: string): Promise<number | null>;
  }