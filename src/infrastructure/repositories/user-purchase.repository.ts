// src/infrastructure/repositories/typeorm-user-purchase.repository.ts

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
  UserPurchaseRepositoryInterface,
} from 'src/domain/repositories/user-purchase.repository';
import { UserPropertyPurchase } from 'src/domain/entities/user-property-purchase.entity';
import { Residential } from 'src/domain/entities/residential.entity';
import { User } from 'src/domain/entities/user.entity';
import { PurchaseStatus } from 'src/domain/enums/property-purchases.enum';

@Injectable()
export class UserPurchaseRepository
  implements UserPurchaseRepositoryInterface
{
  constructor(
    @InjectRepository(UserPropertyPurchase)
    private readonly repo: Repository<UserPropertyPurchase>
  ) {}

  async reversePropertyForUser(residential: Residential, user: User){
    const purchase = await this.repo.create({
      residential,
      user,
      status: PurchaseStatus.RESERVED
    });

    await this.repo.save(purchase);
  }

  async findByUserId(userId: number) {
    return this.repo
      .createQueryBuilder('up')
      .innerJoin('up.residential', 'r')
      .innerJoin('r.property', 'p')
      .innerJoin('p.post', 'pp')
      .innerJoin('p.region', 'region')
      .innerJoin('region.city', 'city')
      .where('up.user_id = :userId', { userId })
      .select([
        'up.id              AS "purchaseId"',
        'up.status          AS status',
        'up.created_at      AS date',
        'p.id               AS "propertyId"',
        'pp.title           AS "postTitle"',
        'pp.image           AS "postImage"',
        'region.name        AS "regionName"',
        'city.name          AS "cityName"',
      ])
      .orderBy('up.created_at', 'DESC')
      .getRawMany();
  }
}
