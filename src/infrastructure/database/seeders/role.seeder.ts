
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/domain/entities/role.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RoleSeeder {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly dataSource: DataSource,
  ) {}

  private readonly roles = ['مشرف', 'مدير', 'صاحب مكتب', 'مزود خدمة'];

  async seed() {
    await this.dataSource.query('TRUNCATE TABLE roles RESTART IDENTITY CASCADE');

    for (const name of this.roles) {
      await this.roleRepo.save({ name });
    }


    console.log('✅ Roles have been seeded successfully.');
  }
}
