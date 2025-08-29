import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/domain/entities/permissions.entity';
import { Role } from 'src/domain/entities/role.entity';
import { User } from 'src/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository, DataSource } from 'typeorm';
import { UserRole } from 'src/domain/entities/user-role.entity';
import { UserPermission } from 'src/domain/entities/user-permission.entity';

@Injectable()
export class ManagerSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
    @InjectRepository(UserPermission)
    private readonly userPermissionRepo: Repository<UserPermission>,
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    const managerRole = await this.roleRepo.findOne({
      where: { name: 'مدير' },
    });

    if (!managerRole) {
      return;
    }
    const allPermissions = await this.permissionRepo.find();

    const hashedPassword = await bcrypt.hash('admin123456789', 10);

    const managerUser = this.userRepo.create({
      first_name: 'Super',
      last_name: 'Admin',
      email: 'admin@example.com',
      username:'admin',
      password: hashedPassword,
      stripe_customer_id: '4444444444444444',
    });

    await this.userRepo.save(managerUser);

    // 4. اربط المستخدم بدور المدير
    const userRole = this.userRoleRepo.create({
      user: managerUser,
      role: managerRole,
    });

    await this.userRoleRepo.save(userRole);

    // 5. اربط الدور بجميع الصلاحيات
    const userPermissions: UserPermission[] = allPermissions.map((permission) =>
      this.userPermissionRepo.create({
        user: managerUser,
        permission: permission,
      }),
    );

    await this.userPermissionRepo.save(userPermissions);

    console.log('✅ Admin user seeded with Manager role and all permissions.');
  }
}
