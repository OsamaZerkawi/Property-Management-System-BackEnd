
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/domain/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeeder {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  private readonly roles = ['مشرف', 'مدير', 'صاحب-مكتب', 'مستخدم'];

  async seed() {
    for (const name of this.roles) {
      const exists = await this.roleRepo.findOneBy({ name });
      if (!exists) {
        await this.roleRepo.save({ name });
      }
    }

    console.log('✅ Roles have been seeded successfully.');
  }
}
