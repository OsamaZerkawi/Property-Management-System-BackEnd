
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Office } from 'src/domain/entities/offices.entity';
import { Property } from 'src/domain/entities/property.entity';
import { Touristic } from 'src/domain/entities/touristic.entity';
import { Service } from 'src/domain/entities/services.entity';
import { AdditionalService } from 'src/domain/entities/additional-service.entity';
import { User } from 'src/domain/entities/user.entity';
import { UserRole } from 'src/domain/entities/user-role.entity';
import { Role } from 'src/domain/entities/role.entity';
import { Region } from 'src/domain/entities/region.entity';
import * as bcrypt from 'bcrypt';
import { OfficeType } from 'src/domain/enums/office-type.enum';
import { PaymentMethod } from 'src/domain/enums/payment-method.enum';
import { TouristicStatus } from 'src/domain/enums/touristic-status.enum';
import { PropertyType } from 'src/domain/enums/property-type.enum';
import { PropertyFurnishingType } from 'src/domain/enums/property-furnishing-type.enum';

@Injectable()
export class TouristicPropertySeeder {
  constructor(
    @InjectRepository(Office) private officeRepo: Repository<Office>,
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
    @InjectRepository(Touristic) private touristicRepo: Repository<Touristic>,
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
    @InjectRepository(AdditionalService) private additionalRepo: Repository<AdditionalService>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserRole) private userRoleRepo: Repository<UserRole>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Region) private regionRepo: Repository<Region>,
  ) {}

  async seed() {
    const regions = await this.regionRepo.find();
    const officeRole = await this.roleRepo.findOne({ where: { name: 'صاحب مكتب' } });
    if (!officeRole) throw new Error('Role not found');

    const services = await this.seedServices(); // Fill default services if not present

    for (let i = 0; i < 5; i++) {
      const region = faker.helpers.arrayElement(regions);
      const password = await bcrypt.hash('password123', 10);
      const user = this.userRepo.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        phone: `09${faker.string.numeric(8)}`,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: password,
      });
      await this.userRepo.save(user);

      await this.userRoleRepo.save({ user, role: officeRole });

      const office = this.officeRepo.create({
        name: faker.company.name(),
        logo: faker.image.avatar(),
        type: OfficeType.TOURISTIC,
        commission: faker.number.float({ min: 1, max: 10 }),
        booking_period: 7,
        tourism_deposit: 2000,
        tourism_deposit_percentage: 10,
        payment_method: PaymentMethod.BOTH,
        opening_time: '08:00 صباحًا',
        closing_time: '08:00 مساءً',
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        region,
        user,
        active: true,
        is_deleted: false,
      });
      await this.officeRepo.save(office);

      for (let j = 0; j < 10; j++) {
        const property = this.propertyRepo.create({
          area: faker.number.float({ min: 50, max: 200 }),
          floor_number: faker.number.int({ min: 0, max: 5 }),
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
          region,
          office,
          room_count: faker.number.int({ min: 1, max: 4 }),
          bathroom_count: 2,
          kitchen_count: 1,
          living_room_count: 1,
          has_furniture: faker.helpers.arrayElement(Object.values(PropertyFurnishingType)),
          property_type: PropertyType.TOURISTIC,
          highlighted: faker.datatype.boolean(),
          rate: 0,
        });
        await this.propertyRepo.save(property);

        const touristic = this.touristicRepo.create({
          property,
          price: faker.number.float({ min: 1000, max: 5000 }),
          street: faker.location.street(),
          electricity: faker.helpers.arrayElement([
            'كهرباء 24 ساعة',
            'كهرباء بالطاقة الشمسية',
            'يوجد كهرباء مع انقطاع جزئي',
            'لا يوجد كهرباء',
            'مولد كهرباء خاص'
          ]),
          water: faker.helpers.arrayElement([
            'ماء حكومي دائم',
            'ماء من بئر خاص',
            'ماء عبر صهريج فقط',
            'انقطاع متكرر في الماء',
            'لا يوجد مصدر ماء دائم'
          ]),
          pool: faker.helpers.arrayElement([
            'يوجد مسبح خاص',
            'يوجد مسبح مشترك',
            'لا يوجد مسبح',
            'مسبح للأطفال فقط',
            'مسبح موسمي (يعمل صيفًا فقط)'
          ]),
          status: faker.helpers.arrayElement(Object.values(TouristicStatus)),
        });
        await this.touristicRepo.save(touristic);

        const randomServices = faker.helpers.arrayElements(services, faker.number.int({ min: 1, max: 3 }));
        const additions = randomServices.map((s) => {
          return this.additionalRepo.create({
            touristicId: touristic.id,
            serviceId: s.id,
          });
        });
        await this.additionalRepo.save(additions);
      }
    }

    console.log('✅ Seeded touristic properties with additional services.');
  }

  private async seedServices(): Promise<Service[]> {
    const names = [
      'واي فاي',
      'تنظيف',
      'إفطار',
      'موقف سيارات',
      'خدمة دليل سياحي',
      'مكيف هواء',
      'مصعد',
      'تلفاز',
      'حمام خاص',
      'مطبخ مشترك',
      'مسبح',
      'غرفة لياقة بدنية',
      'خدمة غسيل',
      'استقبال على مدار الساعة',
      'خزنة',
      'تدفئة مركزية',
      'شرفة',
      'خدمة الغرف',
      'مسموح بالحيوانات الأليفة',
      'توصيل للمطار',
    ];
    const existing = await this.serviceRepo.find();
    if (existing.length > 0) return existing;

    const services = names.map((name) => this.serviceRepo.create({ name }));
    return this.serviceRepo.save(services);
  }
}
