
// src/seeds/service-provider.seeder.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { ServiceProvider } from 'src/domain/entities/service-provider.entity';
import { User } from 'src/domain/entities/user.entity';
import { Region } from 'src/domain/entities/region.entity';
import { Role } from 'src/domain/entities/role.entity';
import { UserRole } from 'src/domain/entities/user-role.entity';
import { ServiceProviderType } from 'src/domain/enums/service-provider-type.enum';

@Injectable()
export class ServiceProviderSeeder {
  constructor(
    @InjectRepository(ServiceProvider)
    private readonly serviceProviderRepo: Repository<ServiceProvider>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Region)
    private readonly regionRepo: Repository<Region>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
  ) {}

  async seed() {
    const regions = await this.regionRepo.find();
    const serviceProviderRole = await this.roleRepo.findOne({
      where: { name: 'مزود خدمة' },
    });

    if (!serviceProviderRole) {
      throw new Error('Service Provider role not found');
    }

    for (let i = 0; i < 10; i++) {
      const region = faker.helpers.arrayElement(regions);
      const password = await bcrypt.hash('password123', 10);

      const user = this.userRepo.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        phone: `09${faker.string.numeric(8)}`,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password,
      });

      await this.userRepo.save(user);
      await this.userRoleRepo.save({ user, role: serviceProviderRole });

      const provider = this.serviceProviderRepo.create({
        name: `مزود خدمة ${i + 1}`,
        logo: `/uploads/service-providers/logo${i + 1}.png`,
        details: faker.lorem.sentences(2),
        career: faker.helpers.arrayElement(Object.values(ServiceProviderType)),
        active: faker.datatype.boolean(),
        opening_time: getRandomTimeWithPeriod(8, 10),
        closing_time: getRandomTimeWithPeriod(16, 20),
        user,
        region,
      });

      await this.serviceProviderRepo.save(provider);
    }

    console.log('✅ Service providers seeded successfully');
  }
}

function getRandomTimeWithPeriod(startHour: number, endHour: number): string {
  const hour = faker.number.int({ min: startHour, max: endHour });
  const minutes = faker.helpers.arrayElement(['00', '15', '30', '45']);
  const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
  const period = hour < 12 ? 'صباحًا' : 'مساءً';
  return `${hourStr}:${minutes} ${period}`;
}
