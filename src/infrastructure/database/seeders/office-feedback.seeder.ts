
import { Injectable } from '@nestjs/common';
import { faker, Faker } from '@faker-js/faker';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfficeFeedback } from 'src/domain/entities/office-feedback.entity';
import { Office } from 'src/domain/entities/offices.entity';
import { User } from 'src/domain/entities/user.entity';
import { ComplaintStatus } from 'src/domain/enums/complaint-status.enum';


@Injectable()
export class OfficeFeedbackSeeder {
  constructor(
    @InjectRepository(OfficeFeedback) private feedbackRepo: Repository<OfficeFeedback>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Office) private officeRepo: Repository<Office>,
  ) {}

  async seed() {
    const users = await this.userRepo.find();
    const offices = await this.officeRepo.find();

    if (!users.length || !offices.length) {
      console.warn('لا يوجد مستخدمين أو مكاتب كافية للتوليد.');
      return;
    }

    for (const office of offices) {
      const feedbackCount = faker.number.int({ min: 2, max: 5 });
      const usedUserIds = new Set<number>();

      for (let i = 0; i < feedbackCount; i++) {
        const user = faker.helpers.arrayElement(users);
        if (usedUserIds.has(user.id)) continue;
        usedUserIds.add(user.id);

        const feedback = this.feedbackRepo.create({
          office,
          user,
          rate: faker.number.int({ min: 1, max: 5 }),
          status: ComplaintStatus.PENDING, 
        });
        await this.feedbackRepo.save(feedback);
      }
    }

    console.log('✅ Seeded office feedbacks.');
  }
}