import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { PropertyFavorite } from 'src/domain/entities/property-favorite.entity';
import { User } from 'src/domain/entities/user.entity';
import { Property } from 'src/domain/entities/property.entity';

@Injectable()
export class PropertyFavoriteSeeder {
  constructor(
    @InjectRepository(PropertyFavorite)
    private favoriteRepo: Repository<PropertyFavorite>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Property)
    private propertyRepo: Repository<Property>,
  ) {}

  async seed() {
    const users = await this.userRepo.find();
    const properties = await this.propertyRepo.find();

    if (!users.length || !properties.length) {
      console.warn('⚠️ Not enough users or properties available for generation.');
      return;
    }

    for (const user of users) {
      const favoritesCount = faker.number.int({ min: 2, max: 5 });

      const shuffledProperties = properties.sort(() => 0.5 - Math.random());
      const selectedProperties = shuffledProperties.slice(0, favoritesCount);

      const usedPropertyIds = new Set<number>();

      for (const property of selectedProperties) {
        if (usedPropertyIds.has(property.id)) continue;
        usedPropertyIds.add(property.id);

        const exists = await this.favoriteRepo.findOne({
          where: { user: { id: user.id }, property: { id: property.id } },
        });

        if (exists) continue;

        const favorite = this.favoriteRepo.create({
          user,
          property,
        });

        await this.favoriteRepo.save(favorite);
      }
    }

    console.log('✅ Property favorites have been generated successfully.');
  }
}
