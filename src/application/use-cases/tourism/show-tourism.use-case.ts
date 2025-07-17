import { 
  Injectable, 
  Inject,
  NotFoundException,
  UnauthorizedException,
  Logger 
} from '@nestjs/common';
import { OFFICE_REPOSITORY } from 'src/domain/repositories/office.repository';
import { OfficeRepositoryInterface } from 'src/domain/repositories/office.repository';
import { TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';
import { ITourismRepository } from 'src/domain/repositories/tourism.repository'; 

@Injectable()
export class ShowTourismUseCase {
  private readonly logger = new Logger(ShowTourismUseCase.name);

  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
    @Inject(TOURISM_REPOSITORY)
    private readonly tourismRepo: ITourismRepository,
  ) {}

  async execute(userId: number, propertyId: number)  {
    try { 
      const office = await this.officeRepo.findOneByUserId(userId);
      if (!office) throw new NotFoundException('المكتب غير موجود');
 
      const property = await this.tourismRepo.findFullPropertyDetails(
        propertyId, 
        office.id
      );

      if (!property) {
        throw new NotFoundException('العقار غير موجود أو لا ينتمي إلى مكتبك');
      }
      return property;

    } catch (error) {
      this.logger.error(`Failed to fetch property details: ${error.message}`, error.stack);
      throw error;  
    }
  }

  
}