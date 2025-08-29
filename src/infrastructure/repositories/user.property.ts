import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/entities/user.entity';
import { NotificationSender } from 'src/domain/enums/notification-sender.enum';
import { UserRepositoryInterface } from 'src/domain/repositories/user.repository';
import { errorResponse } from 'src/shared/helpers/response.helper';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async getTargetUsers(target: NotificationSender) {
    const qb = this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.userRoles', 'ur')
      .leftJoin('ur.role', 'role')
      .leftJoin('user.fcmTokens', 'fcm');

    switch (target) {
      case NotificationSender.AGENT:
        qb.where('role.name IN (:...roles)', {
          roles: ['مزود خدمة', 'صاحب مكتب'],
        });
        break;

      case NotificationSender.ADMINS:
        qb.where('role.name = :role', { role: 'مشرف' });
        break;

      case NotificationSender.USERS:
        qb.where('ur.id IS NULL');
        break;

      default:
        return [];
    }

    return qb.getMany();
  }

  async findAllWithoutRole() {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.userRoles', 'userRole')
      .where('userRole.id IS NULL')
      .select([
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.phone',
        'user.email',
        'user.created_at',
      ])
      .getMany();
  }

  async deleteUserById(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(errorResponse('المستخدم غير موجود', 404));
    }
    await this.userRepo.delete(userId);
  }

  async findById(userId: number) {
    return this.userRepo.findOne({
      where: { id: userId },
      select: [
        'id',
        'first_name',
        'last_name',
        'phone',
        'email',
        'username',
        'photo',
        'stripe_customer_id',
      ],
    });
  }

  async findByPhone(phone: string) {
    return this.userRepo.findOne({
      where: { phone },
      select: ['id', 'first_name', 'last_name', 'phone', 'email'],
    });
  }

  async findByEmailOrPhone(email?: string, phone?: string) {
    const conditions: { email?: string; phone?: string }[] = [];

    if (email) conditions.push({ email });
    if (phone) conditions.push({ phone });
    if (conditions.length === 0) return undefined;
    return this.userRepo.findOne({ where: conditions });
  }
  async update(userId: number, updateData: Partial<User>) {
    await this.userRepo.update(userId, updateData);
  }

  async findUsersByRoleId(roleId: number) {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.userRoles', 'userRole')
      .leftJoin('userRole.role', 'role')
      .leftJoin('user.userPermissions', 'userPermission')
      .leftJoin('userPermission.permission', 'permission')
      .leftJoin('user.adminCities', 'adminCity')
      .leftJoin('adminCity.city', 'city')
      .where('role.id = :roleId', { roleId })
      .select([
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.username',
        'user.created_at',
        'user.email',

        'userPermission.id',
        'permission.id',
        'permission.name',

        'adminCity.city_id',
      ])
      .getMany();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async save(user: Partial<User>): Promise<User> {
    const entity = this.userRepo.create(user);
    return this.userRepo.save(entity);
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.userRepo.update(userId, { password: hashedPassword });
  }
  async findGlobalInfoById(id: number) {
    return this.userRepo.findOne({
      where: { id },
      select: ['first_name', 'last_name', 'phone', 'photo'],
    });
  }
  async findUserInfoById(id: number) {
    return this.userRepo.findOne({
      where: { id },
      select: ['first_name', 'last_name', 'phone', 'photo', 'email'],
    });
  }
}
