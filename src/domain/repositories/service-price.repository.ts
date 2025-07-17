import { ServiceType } from "../enums/service-type.enum";

export interface IServicePriceRepository {
    findPriceByService(service: ServiceType): Promise<number | null>;
  }