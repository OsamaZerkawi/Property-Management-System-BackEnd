// src/infrastructure/repositories/typeorm-user-purchase.repository.ts

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPurchaseRepositoryInterface } from 'src/domain/repositories/user-purchase.repository';
import { UserPropertyPurchase } from 'src/domain/entities/user-property-purchase.entity';
import { Residential } from 'src/domain/entities/residential.entity';
import { User } from 'src/domain/entities/user.entity';
import { PurchaseStatus } from 'src/domain/enums/property-purchases.enum';
import { addDays } from 'date-fns';

@Injectable()
export class UserPurchaseRepository implements UserPurchaseRepositoryInterface {
  constructor(
    @InjectRepository(UserPropertyPurchase)
    private readonly repo: Repository<UserPropertyPurchase>,
  ) {}
  async save(purchase: UserPropertyPurchase) {
    await this.repo.save(purchase);
  }
  async findOneByUserIdAndPropertyId(userId: number, propertyId: number) {
    return await this.repo.findOne({
      where: {
        user: { id: userId },
        residential: { property: { id: propertyId } },
      },
      relations: ['residential', 'residential.property'],
    });
  }

  async bookPropertyForUser(residential: Residential, user: User) {
    const bookingPeriod = residential.property.office.booking_period;

    const endBooking = addDays(new Date(), bookingPeriod);

    const purchase = await this.repo.create({
      residential,
      user,
      end_booking: endBooking,
      status: PurchaseStatus.RESERVED,
    });

    return await this.repo.save(purchase);
  }

  async findByUserId(userId: number, page: number, items: number) {
    const offset = (page - 1) * items;

    const raws = await this.repo
      .createQueryBuilder('up')
      .innerJoin('up.residential', 'r')
      .innerJoin('r.property', 'p')
      .innerJoin('p.post', 'pp')
      .innerJoin('p.region', 'region')
      .innerJoin('region.city', 'city')
      .where('up.user_id = :userId', { userId })
      .select([
        'up.id AS "purchaseId"',
        'up.status AS status',
        'r.selling_price AS selling_price',
        'up.created_at AS date',
        'p.id AS "propertyId"',
        'pp.title AS "postTitle"',
        'pp.image AS "postImage"',
        'region.name AS "regionName"',
        'city.name AS "cityName"',
        'COUNT(*) OVER() AS total_count',
      ])
      .orderBy('up.created_at', 'DESC')
      .offset(offset)
      .limit(items)
      .getRawMany();

    const total = raws.length ? Number(raws[0].total_count) : 0;

    return { raws, total };
  }
}
