import { Inject, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyReservationFiltersDto } from "src/application/dtos/user-property-reservation/PropertyReservationFilters.dto";
import { UserPropertyPurchase } from "src/domain/entities/user-property-purchase.entity";
import { PropertyReservationRepositoryInterface } from "src/domain/repositories/property-reservation.repository";
import { PROPERTY_REPOSITORY, PropertyRepositoryInterface } from "src/domain/repositories/property.repository";
import { USER_PROPERTY_INVOICES_REPOSITORY, UserPropertyInvoiceRepositoryInterface } from "src/domain/repositories/user-property-invoices.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { Repository } from "typeorm";

export class PropertyReservationRepository implements PropertyReservationRepositoryInterface {
  constructor(
    @InjectRepository(UserPropertyPurchase)
    private readonly userPropertyPurchaseRepo: Repository<UserPropertyPurchase>,
    @Inject(USER_PROPERTY_INVOICES_REPOSITORY)
    private readonly userProeprtyInvoicesRepo: UserPropertyInvoiceRepositoryInterface,
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepo: PropertyRepositoryInterface,
  ){}

  async findAllPropertyReservations(baseUrl: string) {
    return await this.fetchPropertyReservation(baseUrl);
  }

  async findAllPropertyReservationsWithFilters(baseUrl: string, filters: PropertyReservationFiltersDto) {
    return await this.fetchPropertyReservation(baseUrl,filters);
  }

  async findUserPropertyReservationWithDetials(id: number, baseUrl: string) {
    const propertyId = await this.getPropertyIdByReservationId(id);
  
    const query = await this.buildProeprtyReservationQuery(baseUrl);
    const result = await query.getRawOne(); 
  
    if (!result) {
      throw new Error(`Reservation with ID ${id} not found.`);
    }
  
    const invoices = await this.userProeprtyInvoicesRepo.findInvoicesByPropertyId(propertyId);
  
    const isReserved = result.status === 'محجوز';
  
    const formattedResult: any = {
      status: result.status,
      buyer_phone: result.buyer_phone,
      region_name: result.region_name,
      city_name: result.city_name,
      selling_price: result.selling_price,
      image_url: result.image_url,
    };
  
    if (isReserved && result.end_booking) {
      formattedResult.end_booking = new Date(result.end_booking).toISOString().split('T')[0];
    }
  
    formattedResult.financial_records = invoices.map((invoice) => ({
      id: invoice.id,
      amount: invoice.amount,
      reason: invoice.reason,
      status: invoice.status,
      paymentMethod: invoice.paymentMethod,
      invoiceImage: invoice.invoiceImage ? `${baseUrl}/uploads/properties/users/invoices/images/${invoice.invoiceImage}` : null,
      created_at: invoice.created_at.toISOString().split('T')[0],
    }));
  
    return formattedResult;
  }

  async findPropertyReservationDetails(propertyId: number) {
    return await this.propertyRepo.findPropertyReservationDetails(propertyId);
  }
  
  private async fetchPropertyReservation(baseUrl: string,filters?: PropertyReservationFiltersDto){
    const query = await this.buildProeprtyReservationQuery(baseUrl);

    if (filters?.regionId) {
      query.andWhere('region.id = :region', { region: filters.regionId });
    }
    
    if (filters?.cityId) {
      query.andWhere('city.id = :city', { city: filters.cityId });
    }
    
    if (filters?.status) {
      query.andWhere('purchase.status = :status', { status: filters.status });
    }

    const results = await query.getRawMany();
    
    const formattedResults = results.map(result => {
      const isReserved = result.status === 'محجوز';      

      const base = {
        status: result.status,
        buyer_phone: result.buyer_phone,
        region_name: result.region_name,
        city_name: result.city_name,
        selling_price: result.selling_price,
        image_url: result.image_url,
      };      

      if (isReserved && result.end_booking) {
        base['end_booking'] = new Date(result.end_booking).toISOString().split('T')[0];
      }      

      return base;
    });

    return formattedResults;
  }

  private async getPropertyIdByReservationId(id: number){
    const result = await this.userPropertyPurchaseRepo
    .createQueryBuilder('purchase')
    .leftJoin('purchase.residential','residential')
    .leftJoin('residential.property','property')
    .where('purchase.id = :id',{id})
    .select('property.id','propertyId')
    .getRawOne();

    if(!result || !result.propertyId){
        throw new NotFoundException(
            errorResponse(`لم يتم العثور على العقار المرتبط بالحجز رقم ${id}`,404)
        );
    }

    return result.propertyId;
  }

  private async buildProeprtyReservationQuery(baseUrl: string){
    return await this.userPropertyPurchaseRepo
        .createQueryBuilder('purchase')
        .leftJoin('purchase.user', 'user')
        .leftJoin('purchase.residential', 'residential')
        .leftJoin('residential.property', 'property')
        .leftJoin('property.region', 'region')
        .leftJoin('region.city', 'city')
        .leftJoin('property.post', 'post')
        .select([
          'purchase.end_booking AS end_booking',
          'purchase.status AS status',
          'user.phone AS buyer_phone',
          'region.name AS region_name',
          'city.name AS city_name',
          'residential.selling_price AS selling_price',
          `CONCAT('${baseUrl}/uploads/properties/posts/images/', post.image) AS image_url`
        ])
  }
}