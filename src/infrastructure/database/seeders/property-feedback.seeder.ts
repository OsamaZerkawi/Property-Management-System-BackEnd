import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyFeedback } from "src/domain/entities/property-feedback.entity";
import { Property } from "src/domain/entities/property.entity";
import { User } from "src/domain/entities/user.entity";
import { Repository } from "typeorm";
import { Faker, ar } from '@faker-js/faker';

const faker = new Faker({ locale: [ar] });

@Injectable()
export class PropertyFeedbackSeeder {
    constructor(
      @InjectRepository(PropertyFeedback) private feedbackRepo: Repository<PropertyFeedback>,
      @InjectRepository(User) private userRepo: Repository<User>,
      @InjectRepository(Property) private propertyRepo: Repository<Property>,        
    ){}

    async seed(){
      const users = await this.userRepo.find();
      const properties = await this.propertyRepo.find();
  
      for (const property of properties) {
        const feedbackCount = faker.number.int({ min: 3, max: 6 });
        const usedUserIds = new Set<number>();
  
        for (let i = 0; i < feedbackCount; i++) {
          const user = faker.helpers.arrayElement(users);
  
          if (usedUserIds.has(user.id)) continue;
          usedUserIds.add(user.id);
  
          const feedback = this.feedbackRepo.create({
            property,
            user,
            rate: faker.number.int({ min: 1, max: 5 }),
          });
          await this.feedbackRepo.save(feedback);
        }
      }
  
      console.log('✅ Seeded property feedbacks.');        
    }
}