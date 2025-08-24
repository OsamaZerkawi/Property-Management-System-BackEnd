import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { addDays, addMonths, startOfDay } from "date-fns";
import { stat } from "fs";
import { ResidentialPropertiesSearchFiltersDto } from "src/application/dtos/property/residential-properties-search-filters.dto";
import { ResidentialPropertyDto } from "src/application/dtos/property/ResidentialProperty.dto";
import { UpdateResidentialPropertyDetailsDto } from "src/application/dtos/property/UpdateResidentialPropertyDetails.dto";
import { Property } from "src/domain/entities/property.entity";
import { Residential } from "src/domain/entities/residential.entity";
import { UserPropertyInvoice } from "src/domain/entities/user-property-invoice.entity";
import { UserPropertyPurchase } from "src/domain/entities/user-property-purchase.entity";
import { InoviceReasons } from "src/domain/enums/inovice-reasons.enum";
import { InvoicesStatus } from "src/domain/enums/invoices-status.enum";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { PaymentMethod } from "src/domain/enums/payment-method.enum";
import { PropertyPostStatus } from "src/domain/enums/property-post-status.enum";
import { PropertyPostTag } from "src/domain/enums/property-post-tag.enum";
import { PurchaseStatus } from "src/domain/enums/property-purchases.enum";
import { PropertyStatus } from "src/domain/enums/property-status.enum";
import { RentalPeriod } from "src/domain/enums/rental-period.enum";
import { ResidentialPropertyRepositoryInterface } from "src/domain/repositories/residential-property.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { DataSource, DeepPartial, Repository} from "typeorm";

export class ResidentialPropertyRepository implements ResidentialPropertyRepositoryInterface{
    constructor(
        @InjectRepository(Residential)
        private readonly residentialRepo: Repository<Residential>,
        private readonly dataSource: DataSource
    ){}
    
    async updateStatusOfProperty(propertyId: number, status: PropertyStatus) {
      const residentialProperty = await this.residentialRepo.findOne({where : {property : {id : propertyId}}});

      if(!residentialProperty){
        throw new NotFoundException(
          errorResponse('العقار السكني غير موجود',404)
        );
      }
      
      residentialProperty.status = status;
      
      await this.residentialRepo.save(residentialProperty);

      return this.residentialRepo.findOne({
        where: { property: { id: propertyId } },
        relations: ['property','property.office']
      });

    }

    async createResidentialPropertyAndSaveIt(data: ResidentialPropertyDto) {
       const { property, ownership_type, direction, listingType, rent_details, sell_details } = data;
       
       const baseData = { property, ownership_type, direction, listing_type: listingType };

        const listingData =
          listingType === ListingType.RENT
            ? {
                rental_price: rent_details?.rentalPrice,
                rental_period: rent_details?.rental_period,
              }
            : {
                selling_price: sell_details?.selling_price,
                installment_allowed: sell_details?.installment_allowed,
                installment_duration: sell_details?.installment_duration,
              };
      
        const residential = this.residentialRepo.create({ ...baseData, ...listingData });
        return await this.residentialRepo.save(residential);
  }

  async findById(id: any) {
    return await this.residentialRepo.findOne({
    where: { id },
    relations: {
      property: {
        region: {
          city: true,
        },
        office: true,
        post: true,
      },
    },
  });
  }
  
  async findOneByPropertyId(propertyId: number): Promise<Residential|null> {
    console.log('property_id',propertyId);
    return await this.residentialRepo.createQueryBuilder('residential')
      .innerJoinAndSelect('residential.property', 'property')  
      .where('property.id = :propertyId', { propertyId })
      .getOne();  
  } 

  async updateResidentialProperty(propertyId: number, data: UpdateResidentialPropertyDetailsDto) {
    const residentialProperty = await this.residentialRepo.findOne({where: { property: {id: propertyId}}});
    
    if(!residentialProperty){
      throw new NotFoundException(
        errorResponse('لا يوجد عقار سكني بهذا المعرف ',404)
      );
    }
    
    const id = residentialProperty.id;
    const updatePayload = this.buildUpdatePayload(data);

    const allowedStatuses = [
      PropertyStatus.AVAILABLE,
      PropertyStatus.UNAVAILABLE,
      PropertyStatus.UNDER_MAINTENANCE,
    ];
    
    if (data.status && allowedStatuses.includes(data.status)) {
      updatePayload.status = data.status;
    }
    
    await this.residentialRepo
      .createQueryBuilder()
      .update(Residential)
      .set(updatePayload)
      .where("id = :id", { id })
      .execute();
    
    const updatedResidentialProperty = await this.residentialRepo
    .createQueryBuilder("residential")
    .where("residential.id = :id", { id })
    .getOne();
    
    return updatedResidentialProperty;
  }

  async searchFilteredResidentialsProperties(baseUrl: string, filters: ResidentialPropertiesSearchFiltersDto,page: number,items: number,userId: number) {
    const query = this.buildBaseQuery();
    const filterMap = this.getFilterMap();

    //Apply simple filters using the map
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && filterMap.has(key as keyof ResidentialPropertiesSearchFiltersDto)) {
        filterMap.get(key as keyof ResidentialPropertiesSearchFiltersDto)!(query, value);
      }
    });

    this.applyRoomDetailsFilter(query,filters.room_details);
    filters.tag && this.applyTagsFilters(query, filters.tag);

    query.select([      
      'property.id',
      'property.area',
      'property.region',
      'property.rate',
      
      'post.id',
      'post.title',
      'post.image',
      'post.status',
      'post.description',

      'residential.id',
      'residential.listing_type',
      'residential.selling_price',
      'residential.rental_price',
      'residential.rental_period',
      
      'region.id',
      'region.name',
      
      'city.id',
      'city.name'

    ]);

    if (userId) {
      query.addSelect(
            `CASE
               WHEN EXISTS(
                 SELECT 1 FROM property_favorites pf 
                 WHERE pf.property_id = property.id AND pf.user_id = :userId
               ) THEN true
               ELSE false
             END`,
            'is_favorite'
      )
      .setParameter('userId',userId)
    }

    query.addSelect(
      `CASE
         WHEN residential.listing_type = :rent THEN residential.rental_price
         ELSE residential.selling_price
       END`,
      'calculated_price'
    ).setParameters({
      rent: ListingType.RENT,
      yearly: RentalPeriod.YEARLY,
    });

    query.addSelect('COALESCE(AVG(feedback.rate), 0)', 'avg_rate')
      .groupBy('property.id')
      .addGroupBy('post.id')
      .addGroupBy('region.id')
      .addGroupBy('city.id')
      .addGroupBy('residential.id');
    
    const [rawResults, total] = await Promise.all([
      query.skip((page - 1) * items).take(items).getRawAndEntities(),
      query.getCount(),
    ]);
  

    const entities = rawResults.entities;
    const raw = rawResults.raw;
  
    // Create a map of propertyId -> avg_rate
    const avgRateMap = new Map<number, number>();
    raw.forEach(row => {
      const propertyId = Number(row.property_id);
      const avgRate = parseFloat(parseFloat(row.avg_rate).toFixed(1)) || 0;
      avgRateMap.set(propertyId, avgRate);
    });

    const final = entities.map((entity, index) => ({
      ...entity,
      property: {
        ...entity.property,
        avgRate : avgRateMap.get(entity.id) || 0,  
        calculated_price: Number(raw[index]?.calculated_price),
        is_favorite: raw[index]?.is_favorite === true || raw[index]?.is_favorite === 'true' ? 1 : 0,
      },
    }));

  const formatted = final.map((residential) => this.formatResidential(residential, baseUrl));

  return [formatted, total];
  }
  
  private formatResidential(residential,baseUrl: string) {
    const property = residential.property;
  
    const base = {
      propertyId: property.id,
      postTitle: property.post?.title ?? '',
      postDescription: property.post.description,
      postImage: `${baseUrl}/uploads/properties/posts/images/${property.post?.image ?? 'default.jpg'}`,
      location: `${property.region?.city?.name ?? ''}, ${property.region?.name ?? ''}`,
      is_favorite: property.is_favorite ? 1 : 0,
    };
  
    if (residential.listing_type === ListingType.RENT) {
      return {
        ...base,
        listing_type: 'أجار',
        price: property.calculated_price,
        rate:property.avgRate
      };
    } else {
      return {
        ...base,
        listing_type: 'بيع',
        price: property.calculated_price,
      };
    }
  }

  private getFilterMap(){
    return new Map<keyof ResidentialPropertiesSearchFiltersDto, (query: any,value: any) => void>([
      ['regionId', (q, v) => q.andWhere('property.region_id = :regionId', { regionId: v })],
      ['cityId', (q, v) => q.andWhere('city.id = :cityId', { cityId: v })],
      ['listing_type', (q, v) => q.andWhere('residential.listing_type = :listing_type', { listing_type: v })],
      ['ownership_type', (q, v) => q.andWhere('residential.ownership_type = :ownership_type', { ownership_type: v })],
      ['status', (q, v) => q.andWhere('residential.status = :status', { status: v })],
      ['has_furniture', (q, v) => q.andWhere('property.has_furniture = :has_furniture', { has_furniture: v })],
      ['direction', (q, v) => q.andWhere('residential.direction = :direction', { direction: v })],
      ['minPrice', (q, v) => q.andWhere('(residential.rental_price >= :minPrice OR residential.selling_price >= :minPrice)', { minPrice: v })],
      ['maxPrice', (q, v) => q.andWhere('(residential.rental_price <= :maxPrice OR residential.selling_price <= :maxPrice)', { maxPrice: v })],
      ['minArea', (q, v) => q.andWhere('property.area >= :minArea', { minArea: v })],
      ['maxArea', (q, v) => q.andWhere('property.area <= :maxArea', { maxArea: v })],
      ['floor_number', (q, v) => q.andWhere('property.floor_number = :floor_number', { floor_number: v })],    
    ]);
  }

  private applyRoomDetailsFilter(query: any,roomDetails?: ResidentialPropertiesSearchFiltersDto['room_details']){
    if (!roomDetails) return; 

    const roomFilters = [
      { key: 'room_count', field: 'property.room_count' },
      { key: 'bedroom_count', field: 'property.bedroom_count' },
      { key: 'living_room_count', field: 'property.living_room_count' },
      { key: 'kitchen_count', field: 'property.kitchen_count' },
      { key: 'bathroom_count', field: 'property.bathroom_count' },
    ];

    roomFilters.forEach(({ key, field }) => {
      const value = roomDetails[key as keyof typeof roomDetails];
      if (value !== undefined) {
        query.andWhere(`${field} = :${key}`, { [key]: value });
      }
    });
  }

  private applyTagsFilters(query: any,tag: PropertyPostTag){
    if(tag){
      query.andWhere('post.tag = :tag', { tag });
    }
  }

  private buildBaseQuery(){
    return this.residentialRepo
      .createQueryBuilder('residential')
      .leftJoin('residential.property', 'property')
      .leftJoin('property.region', 'region')
      .leftJoin('region.city', 'city')
      .leftJoin('property.post', 'post')
      .leftJoin('property.feedbacks', 'feedback')
      .where('property.is_deleted = false')
      .andWhere('post.status = :statusPost', { statusPost: PropertyPostStatus.APPROVED })
      .andWhere('residential.status = :resStatus',{resStatus: PropertyStatus.AVAILABLE});
  }

  private buildUpdatePayload(data: UpdateResidentialPropertyDetailsDto): Partial<Residential> {
    const payload: Partial<Residential> = {};
  
    if (data.listingType !== undefined) payload.listing_type = data.listingType;
    if (data.ownership_type !== undefined) payload.ownership_type = data.ownership_type;
    if (data.direction !== undefined) payload.direction = data.direction;

    // Rent details
    if (data.rent_details) {
      const rent = data.rent_details;
      if (rent.rental_period !== undefined) payload.rental_period = rent.rental_period;
      if (rent.rentalPrice !== undefined) payload.rental_price = rent.rentalPrice;
    }
  
    // Sell details
    if (data.sell_details) {
      const sell = data.sell_details;
      if (sell.selling_price !== undefined) payload.selling_price = sell.selling_price;
      if (sell.installment_allowed !== undefined) payload.installment_allowed = sell.installment_allowed;
      if (sell.installment_duration !== undefined) payload.installment_duration = sell.installment_duration;
    }

    return payload;
  }

  async findTopResidentialLocationsByOffice(officeId: number): Promise<string[]> {
    const qb = this.residentialRepo
      .createQueryBuilder('res')
      .innerJoin('res.property', 'p')
      .innerJoin('p.region', 'r')
      .innerJoin('r.city', 'city')
      .where('p.office_id = :officeId', { officeId })
      .andWhere('res.status IN (:...states)', {
        states: ['تم البيع', 'تم التأجير'],
      })
      .select([
        "city.name || '، ' || r.name AS location",
        'COUNT(res.id) AS cnt',
      ])
      .groupBy('city.name, r.name')
      .orderBy('cnt', 'DESC')
      .limit(10);

    const raws = await qb.getRawMany();
    return raws.map(r => String(r.location));
  }

    async createPurchaseWithInvoices(options: {
    userId: number;
    propertyId: number;
    deposit: number;
    totalPrice: number;
    paymentIntentId?: string | null;
    installment: boolean;
  }): Promise<void> {
    const { userId, propertyId, deposit, totalPrice, paymentIntentId, installment } = options;

    await this.dataSource.transaction(async (manager) => {
  
      const property = await manager.findOne(Property, {
        where: { id: propertyId },
        relations: ['residential', 'office'],
      });

    if (!property) throw new NotFoundException('العقار غير موجود');
    if (!property.residential) throw new NotFoundException('هذا العقار ليس سكنياً أو تفاصيله غير موجودة');


    const residential = property.residential;
    const office = property.office;
 
    const isAvailable = residential.status===PropertyStatus.AVAILABLE;
 
    if (!isAvailable) {
      throw new BadRequestException('العقار محجوز أو غير متاح حالياً');
    }
      const nowStart = startOfDay(new Date());
      const purchaseRepo = manager.getRepository(UserPropertyPurchase);
      const purchase = purchaseRepo.create({
        user: { id: userId } as any,
        residential: { id: residential.id } as any,
        date: new Date(),
        status: PurchaseStatus.RESERVED,
      } as DeepPartial<UserPropertyPurchase>);
      await purchaseRepo.save(purchase);
 
      const invoiceRepo = manager.getRepository(UserPropertyInvoice);
      const bookingPeriodDays = Number(office?.booking_period ?? 0);
      const depositInvoice = invoiceRepo.create({
        user: { id: userId } as any,
        property: { id: propertyId } as any,
        amount: deposit,
        billing_period_start: nowStart,
        reason: InoviceReasons.DEPOSIT,
        status: InvoicesStatus.PAID,
        stripePaymentIntentId: paymentIntentId ?? undefined, 
        payment_deadline:nowStart,
        paymentMethod: PaymentMethod.STRIPE,
      });
      await invoiceRepo.save(depositInvoice);

     residential.status = 'محجوز' as any;
     await manager.save(Residential, residential);

      const remaining = Number(totalPrice) - Number(deposit);
      const firstDueDeadline = bookingPeriodDays > 0 ? addDays(nowStart, bookingPeriodDays) : addDays(nowStart, 1);
      if (!installment) { 
        const remInvoice = invoiceRepo.create({
          user: { id: userId } as any,
          property: { id: propertyId } as any,
          amount: remaining,
          billing_period_start: startOfDay(new Date()),
          reason: InoviceReasons.PROPERTY_PURCHASE,
          status: InvoicesStatus.PENDING,
          stripePaymentIntentId: undefined,
          payment_deadline:  firstDueDeadline,
          paymentMethod: PaymentMethod.STRIPE,
        });
        await invoiceRepo.save(remInvoice);
      } else { 
        const months = Number(residential.installment_duration ?? 0);
        if (!months || months <= 0) {
          throw new BadRequestException('مدة التقسيط غير معرفة في تفاصيل العقار');
        }

        const base = Math.floor((remaining / months) * 100) / 100;  
        let accumulated = 0;
        let dueDate = startOfDay(new Date());

        for (let i = 0; i < months; i++) {
          const isLast = i === months - 1;
          const amount = isLast ? Number((remaining - accumulated).toFixed(2)) : Number(base.toFixed(2));
          accumulated += amount;
        const paymentDeadline = (i === 0) ? firstDueDeadline : addMonths(dueDate, 1);
          const installmentInvoice = invoiceRepo.create({
            user: { id: userId } as any,
            property: { id: propertyId } as any,
            amount,
            billing_period_start: startOfDay(dueDate),
            reason: InoviceReasons.INSTALLMENT_PAYMENT,
            status: InvoicesStatus.PENDING,
            stripePaymentIntentId: undefined,
            payment_deadline:paymentDeadline,
            paymentMethod: PaymentMethod.STRIPE,
          });
          await invoiceRepo.save(installmentInvoice);

          dueDate = addMonths(dueDate, 1);
        }
      }
    });  
  }

}