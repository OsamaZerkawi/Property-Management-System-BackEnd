import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
import { PropertyPostStatus } from 'src/domain/enums/property-post-status.enum';
import { PropertyPostTag } from 'src/domain/enums/property-post-tag.enum';
import { PropertyPost } from 'src/domain/entities/property-posts.entitiy';
import { Image } from 'src/domain/entities/image.entity';

@Injectable()
export class TouristicPropertySeeder {
  constructor(
    @InjectRepository(Office) private officeRepo: Repository<Office>,
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
    @InjectRepository(Image) private readonly imageRepo: Repository<Image>,
    @InjectRepository(Touristic) private touristicRepo: Repository<Touristic>,
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
    @InjectRepository(AdditionalService)
    private additionalRepo: Repository<AdditionalService>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserRole) private userRoleRepo: Repository<UserRole>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Region) private regionRepo: Repository<Region>,
    @InjectRepository(PropertyPost)
    private readonly propertyPostRepo: Repository<PropertyPost>,
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    const regions = await this.regionRepo.find();
    const officeRole = await this.roleRepo.findOne({
      where: { name: 'صاحب مكتب' },
    });
    if (!officeRole) throw new Error('Role not found');

    const services = await this.seedServices(); // Fill default services if not present

    for (let i = 0; i < 5; i++) {
      const { latitude, longitude } = randomLocationInSyria();

      const region = faker.helpers.arrayElement(regions);
      const password = await bcrypt.hash('password123', 10);
      const user = this.userRepo.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        phone: `09${faker.string.numeric(8)}`,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: password,
        stripe_customer_id: faker.string.numeric(16),
      });
      await this.userRepo.save(user);

      await this.userRoleRepo.save({ user, role: officeRole });

      const office = this.officeRepo.create({
        name: faker.company.name(),
        logo: 'office.jpeg',
        type: OfficeType.TOURISTIC,
        commission: faker.number.float({
          min: 0.01,
          max: 0.1,
          fractionDigits: 2,
        }),
        booking_period: faker.number.int({ min: 1, max: 30 }),
        deposit_per_m2: faker.number.float({
          min: 1,
          max: 50,
          fractionDigits: 2,
        }),
        tourism_deposit: faker.number.float({
          min: 0.01,
          max: 0.1,
          fractionDigits: 2,
        }),
        creditCard:faker.string.numeric(16),
        payment_method: PaymentMethod.BOTH,
        opening_time: '08:00 صباحًا',
        closing_time: '08:00 مساءً',
        latitude,
        longitude,
        region,
        user,
        active: true,
        is_deleted: false,
      });
      await this.officeRepo.save(office);

      for (let j = 0; j < 10; j++) {
        const { latitude, longitude } = randomLocationInSyria();

        const region = faker.helpers.arrayElement(regions);
        const property = this.propertyRepo.create({
          area: faker.number.float({ min: 50, max: 300 }),
          floor_number: faker.number.int({ min: 0, max: 5 }),
          latitude,
          longitude,
          region,
          office,
          room_count: faker.number.int({ min: 1, max: 4 }),
          bathroom_count: 2,
          kitchen_count: 1,
          living_room_count: 1,
          has_furniture: faker.helpers.arrayElement(
            Object.values(PropertyFurnishingType),
          ),
          property_type: PropertyType.TOURISTIC,
          highlighted: faker.datatype.boolean(),
          rate: 0,
        });

        const savedProperty = await this.propertyRepo.save(property);

        const tagValue = faker.helpers.arrayElement(
          Object.values(PropertyPostTag),
        );
        const areaValue = property.area.toFixed(2);

        const post = this.propertyPostRepo.create({
          property,
          title: `${tagValue} ${areaValue} م²`, // العنوان مكون من تاج ومساحة العقار
          description: faker.lorem.sentences(2),
          image: 'tourisem.png',
          tag: tagValue,
          status: faker.helpers.arrayElement(Object.values(PropertyPostStatus)),
          date: faker.date.recent(),
        });

        await this.propertyPostRepo.save(post);

        const imageCount = faker.number.int({ min: 1, max: 4 });

        const images = Array.from({ length: imageCount }).map(() => {
          return this.imageRepo.create({
            property: savedProperty,
            image_path: 'property.jpeg',
          });
        });

        await this.imageRepo.save(images);

        const touristic = this.touristicRepo.create({
          property,
          price: faker.number.float({ min: 50, max: 1000 }),
          street: faker.location.street(),
          electricity: faker.helpers.arrayElement([
            'كهرباء 24 ساعة',
            'كهرباء بالطاقة الشمسية',
            'يوجد كهرباء مع انقطاع جزئي',
            'لا يوجد كهرباء',
            'مولد كهرباء خاص',
          ]),
          water: faker.helpers.arrayElement([
            'ماء حكومي دائم',
            'ماء من بئر خاص',
            'ماء عبر صهريج فقط',
            'انقطاع متكرر في الماء',
            'لا يوجد مصدر ماء دائم',
          ]),
          pool: faker.helpers.arrayElement([
            'يوجد مسبح خاص',
            'يوجد مسبح مشترك',
            'لا يوجد مسبح',
            'مسبح للأطفال فقط',
            'مسبح موسمي (يعمل صيفًا فقط)',
          ]),
          status: faker.helpers.arrayElement(Object.values(TouristicStatus)),
        });
        await this.touristicRepo.save(touristic);

        const randomServices = faker.helpers.arrayElements(
          services,
          faker.number.int({ min: 1, max: 3 }),
        );
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
      'مكان للشواء',
      'حديقة',
      'منطقة ألعاب أطفال',
      'إطلالة بحرية',
      'إطلالة جبلية',
      'شرفة (بلكون)',
      'جاكوزي',
      'ساونا',
      'مدفأة',
      'موقف سيارات',
      'حراسة / أمان',
      'انترنت واي فاي',
      'تلفزيون مع قنوات فضائية',
      'تكييف هواء',
      'ملعب رياضي',
    ];
    const existing = await this.serviceRepo.find();
    if (existing.length > 0) return existing;

    await this.dataSource.query(
      'TRUNCATE TABLE services RESTART IDENTITY CASCADE',
    );

    const services = names.map((name) => this.serviceRepo.create({ name }));
    return this.serviceRepo.save(services);
  }
}

function randomLocationInSyria() {
  const lat = faker.number.float({
    min: 32.0,
    max: 37.5,
    fractionDigits: 6,
  });

  const lng = faker.number.float({
    min: 35.6,
    max: 42.0,
    fractionDigits: 6,
  });

  return { latitude: lat, longitude: lng };
}
