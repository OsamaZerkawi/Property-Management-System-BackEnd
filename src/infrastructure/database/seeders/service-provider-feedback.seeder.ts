import { Injectable } from '@nestjs/common';
import { faker, Faker } from '@faker-js/faker';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceFeedback } from 'src/domain/entities/service-feedback.entity';
import { ServiceProvider } from 'src/domain/entities/service-provider.entity';
import { User } from 'src/domain/entities/user.entity';

@Injectable()
export class ServiceFeedbackSeeder {
  constructor(
    @InjectRepository(ServiceFeedback) private feedbackRepo: Repository<ServiceFeedback>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(ServiceProvider) private spRepo: Repository<ServiceProvider>,
  ) {}

  async seed() {
    const users = await this.userRepo.find();
    const serviceProviders = await this.spRepo.find();

    if (!users.length || !serviceProviders.length) {
      console.warn('لا يوجد مستخدمين أو موفّرين كافيين للتوليد.');
      return;
    }

    // Track pairs to satisfy unique constraint (user + serviceProvider)
    const usedPairs = new Set<string>();

    // For each service provider, assign a few feedbacks from distinct users
    for (const sp of serviceProviders) {
      const feedbackCount = faker.number.int({ min: 2, max: 5 });

      let attempts = 0;
      let created = 0;
      while (created < feedbackCount && attempts < feedbackCount * 5) {
        attempts++;
        const user = faker.helpers.arrayElement(users);
        const key = `${user.id}-${sp.id}`;
        if (usedPairs.has(key)) continue;
        usedPairs.add(key);

        const feedback = this.feedbackRepo.create({
          serviceProvider: sp,
          user,
          rate:faker.number.int({ min: 1, max: 5 }),
        });
        await this.feedbackRepo.save(feedback);
        created++;
      }
    }

    console.log('✅ Seeded service provider feedbacks.');
  }
}