
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/domain/entities/permissions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionSeeder {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  private readonly permissions = [
    'إدارة المكاتب ومزودي الخدمات',
    'إدارة المالية والإعلانات',
    'إدارة المنشورات وطلبات المستخدمين',
    'إدارة الشكاوي والدعم',
    'مراقبة إحصائيات النظام',
  ];

  async seed() {
    for (const name of this.permissions) {
      const exists = await this.permissionRepo.findOneBy({ name });
      if (!exists) {
        await this.permissionRepo.save({ name });
      }
    }

    console.log('✅ Permissions have been seeded successfully.');
  }
}
