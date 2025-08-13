import { InjectRepository } from '@nestjs/typeorm';
import { AdminCity } from 'src/domain/entities/admin-city.entity';
import { AdminCityRepositoryInterface } from 'src/domain/repositories/admin-city.repository';
import { Repository } from 'typeorm';

export class AdminCityRepository implements AdminCityRepositoryInterface {
  constructor(
    @InjectRepository(AdminCity)
    private readonly adminCityRepo: Repository<AdminCity>,
  ) {}
  async removeAdminCity(userId: number) {
    await this.adminCityRepo.delete({ user_id: userId });
  }

  async updateAdminCity(userId: number, cityId: number) {
    await this.adminCityRepo.upsert(
      { user_id: userId, city_id: cityId },
      ['user_id'],
    );
  }

  async assignCityToAdmin(userId: number, cityId: number) {
    const adminCity = this.adminCityRepo.create({
      user_id: userId,
      city_id: cityId,
    });

    return this.adminCityRepo.save(adminCity);
  }

  async findCityIdByUserId(userId: number) {
    const adminCity = await this.adminCityRepo.findOne({
      where: { user_id: userId },
      select: ['city_id'],
    });

    return adminCity ? adminCity.city_id : null;
  }
}
