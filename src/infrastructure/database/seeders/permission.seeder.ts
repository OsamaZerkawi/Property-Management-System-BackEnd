
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/domain/entities/permissions.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PermissionSeeder {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
    private readonly dataSource: DataSource,
  ) {}

  private readonly permissions = [
    'إدارة الوسطاء',
    'إدارة المالية والإعلانات',
    'إدارة المنشورات',
    'إدارة الشكاوي والدعم',
    'مراقب النظام',
   ];

  async seed() {
    await this.dataSource.query('TRUNCATE TABLE permissions RESTART IDENTITY CASCADE');

    for (const name of this.permissions) {
      await this.permissionRepo.save({ name });
    }


    console.log('✅ Permissions have been seeded successfully.');
  }
}
