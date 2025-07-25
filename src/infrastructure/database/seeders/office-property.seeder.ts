import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Office } from "src/domain/entities/offices.entity";
import { PropertyPost } from "src/domain/entities/property-posts.entitiy";
import { Property } from "src/domain/entities/property.entity";
import { Region } from "src/domain/entities/region.entity";
import { Residential } from "src/domain/entities/residential.entity";
import { User } from "src/domain/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Faker, ar ,en} from '@faker-js/faker';
import { OfficeType } from "src/domain/enums/office-type.enum";
import { PaymentMethod } from "src/domain/enums/payment-method.enum";
import { PropertyType } from "src/domain/enums/property-type.enum";
import { Direction } from "src/domain/enums/direction.enum";
import { OwnershipType } from "src/domain/enums/ownership-type.enum";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { RentalPeriod } from "src/domain/enums/rental-period.enum";
import { PropertyStatus } from "src/domain/enums/property-status.enum";
import { PropertyPostTag } from "src/domain/enums/property-post-tag.enum";
import { PropertyPostStatus } from "src/domain/enums/property-post-status.enum";
import { Image } from "src/domain/entities/image.entity";
import { OfficeSocial } from "src/domain/entities/office-social.entity";
import { UserRole } from "src/domain/entities/user-role.entity";
import { Role } from "src/domain/entities/role.entity";
import { PropertyFurnishingType } from "src/domain/enums/property-furnishing-type.enum";

const faker = new Faker({ locale: [ar, en], });

@Injectable()
export class OfficePropertySeeder {
  constructor(
    @InjectRepository(Office) private officeRepo: Repository<Office>,
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
    @InjectRepository(PropertyPost) private postRepo: Repository<PropertyPost>,
    @InjectRepository(Residential) private residentialRepo: Repository<Residential>,
    @InjectRepository(Region) private regionRepo: Repository<Region>,
    @InjectRepository(User) private userRepo: Repository<User>,    
    @InjectRepository(Image)private imageRepo: Repository<Image>,
    @InjectRepository(OfficeSocial) private socialRepo: Repository<OfficeSocial>,
    @InjectRepository(UserRole) private userRoleRepo: Repository<UserRole>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
        
  ){}
  async seed(){
  const regions = await this.regionRepo.find();
  const socialPlatforms = ['facebook', 'instagram', 'whatsapp', 'twitter'];

  const officeRole = await this.roleRepo.findOne({where: { name: 'صاحب مكتب'}});

  if(!officeRole){
    throw new Error('officer role did not found');
  }

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
      logo: 'office.jpeg', 
      type: OfficeType.RESIDENTIAL,
      commission: faker.number.float({ min: 0, max: 20, fractionDigits: 2 }),
      booking_period: faker.number.int({ min: 1, max: 30 }),
      deposit_per_m2: faker.number.float({ min: 10, max: 200, fractionDigits: 2 }),
      tourism_deposit: faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 }),
      tourism_deposit_percentage: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
      payment_method: faker.helpers.arrayElement(Object.values(PaymentMethod)),
      profits: faker.number.float({ min: 0, max: 100000, fractionDigits:2 }),
      opening_time: getRandomTimeWithPeriod(8, 10),  
      closing_time: getRandomTimeWithPeriod(17, 20), 
      latitude: faker.location.latitude(),  
      longitude: faker.location.longitude(),

      active: true,
      is_deleted: false,
      user,
      region,
    });

    await this.officeRepo.save(office);

    const socialCount = faker.number.int({ min: 1, max: 3 });
      const socials = Array.from({ length: socialCount }).map(() => {
        const platform = faker.helpers.arrayElement(socialPlatforms);
        return this.socialRepo.create({
          platform,
          link: `https://www.${platform}.com/${faker.internet.userName()}`,
          office,
        });
      });
      await this.socialRepo.save(socials);    

    for (let j = 0; j < 10; j++) {
      const property = this.propertyRepo.create({
        area: faker.number.float({ min: 50, max: 300 }),
        floor_number: faker.number.int({ min: 0, max: 10 }),
        latitude: faker.location.latitude(),  
        longitude: faker.location.longitude(),
        region,
        office,
        room_count: faker.number.int({ min: 1, max: 5 }),
        bathroom_count: faker.number.int({ min: 1, max: 3 }),
        kitchen_count: 1,
        living_room_count: faker.number.int({ min: 1, max: 2 }),
        property_type: PropertyType.RESIDENTIAL,
        has_furniture: faker.helpers.arrayElement(Object.values(PropertyFurnishingType)),
        notes: faker.lorem.sentence(),
        rate: 0,
        highlighted: faker.datatype.boolean(),
      });
      const savedProperty = await this.propertyRepo.save(property);

      const imageCount = faker.number.int({ min: 1, max: 4 });
      const images = Array.from({ length: imageCount }).map(() => {
        return this.imageRepo.create({
          property: savedProperty,
          image_path: 'property.jpeg', 
        });
      });      

      await this.imageRepo.save(images);

      const listingType = faker.helpers.arrayElement(Object.values(ListingType));

      const residential = this.residentialRepo.create({
        property,
        direction: faker.helpers.arrayElement(Object.values(Direction)),
        ownership_type: faker.helpers.arrayElement(Object.values(OwnershipType)),
        listing_type: listingType,
        status: faker.helpers.arrayElement(Object.values(PropertyStatus)),
        ...(listingType === ListingType.SALE && {
          selling_price: faker.number.int({ min: 10000000, max: 70000000 }),
          installment_allowed: faker.datatype.boolean(),
          installment_duration: faker.number.int({ min: 1, max: 24 }),
        }),
      
        ...(listingType === ListingType.RENT && {
          rental_price: faker.number.int({ min: 100000, max: 300000 }),
          rental_period: faker.helpers.arrayElement(Object.values(RentalPeriod)),
        }),
      });
      await this.residentialRepo.save(residential);

      const tagValue = faker.helpers.arrayElement(Object.values(PropertyPostTag));
      const areaValue = property.area.toFixed(2); 
      const post = this.postRepo.create({
        property,
        title: `${tagValue} ${areaValue} م²`,  // العنوان مكون من تاج ومساحة العقار
        description: faker.lorem.sentences(2),
        image: 'property.png',
        tag: tagValue,
        status: faker.helpers.arrayElement(Object.values(PropertyPostStatus)),
        date: faker.date.recent(),
      });
      await this.postRepo.save(post);
    }
  }
  console.log('✅ Seeded offices, properties, posts, and residential data.');
  }
}

function getRandomTimeWithPeriod(startHour: number, endHour: number): string {
  const hour = faker.number.int({ min: startHour, max: endHour });
  const minutes = faker.helpers.arrayElement(['00', '15', '30', '45']);
  const hourStr = hour < 10 ? `0${hour}` : `${hour}`;

  // تحديد الفترة صباحًا أو مساءً
  const period = hour < 12 ? 'صباحًا' : 'مساءً';

  return `${hourStr}:${minutes} ${period}`;
}