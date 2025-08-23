
// src/seeds/social-platform.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialPlatform } from 'src/domain/entities/social_platforms.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SocialPlatformSeeder {
  constructor(
    @InjectRepository(SocialPlatform)
    private readonly platformRepo: Repository<SocialPlatform>,
  ) {}

  async seed() {
    const platforms = ['facebook', 'whatsapp', 'instagram'];

    for (const name of platforms) {
      const exists = await this.platformRepo.findOne({ where: { name } });
      if (!exists) {
        await this.platformRepo.save(this.platformRepo.create({ name }));
      }
    }

    console.log('✅ Social platforms seeded successfully');
  }
}
