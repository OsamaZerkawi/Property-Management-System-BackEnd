import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/domain/entities/user.entity";
import { UserRepositoryInterface } from "src/domain/repositories/user.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepo.find({
      select:['id','first_name','last_name','phone','email','created_at'],
    })
  }

  async deleteUserById(userId: number) {
    const user = await this.userRepo.findOne({
      where: {id: userId},
    });
    if(!user){
      throw new NotFoundException(
        errorResponse('المستخدم غير موجود',404)
      );
    }
    await this.userRepo.delete(userId);
  }
  
  async findUsersByRoleId(roleId: number) {
    return this.userRepo
    .createQueryBuilder('user')
    .leftJoin('user.userRoles','userRole')
    .leftJoin('userRole.role','role')
    .leftJoin('user.userPermissions', 'userPermission')
    .leftJoin('userPermission.permission', 'permission')
    .where('role.id = :roleId',{roleId})
    .select([
      'user.id',
      'user.first_name',
      'user.last_name',
      'user.username',
      'user.created_at',
      'userPermission.id',
      'permission.id',
      'permission.name',
    ])
    .getMany();
  }

  async findById(userId: number) {
    return this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'first_name', 'last_name', 'phone', 'email','username'],
    });
  }

  async findByPhone(phone: string) {
    return this.userRepo.findOne({
      where: { phone },
      select: ['id', 'first_name', 'last_name', 'phone', 'email'],
    });
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
  async findByEmailOrPhone(email?: string, phone?: string) {
    const conditions: { email?: string; phone?: string }[] = [];
    
    if (email) conditions.push({ email });
    if (phone) conditions.push({ phone });
    if (conditions.length === 0) return undefined;
    return this.userRepo.findOne({ where: conditions });
  }
  async update(userId: number, updateData: Partial<User>) {
    await this.userRepo.update(userId,updateData);
  }
}

    async findUsersByRoleId(roleId: number) {
      return this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.userRoles','userRole')
      .leftJoin('userRole.role','role')
      .leftJoin('user.userPermissions', 'userPermission')
      .leftJoin('userPermission.permission', 'permission')
      .where('role.id = :roleId',{roleId})
      .select([
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.username',
        'user.created_at',

        'userPermission.id',
        'permission.id',
        'permission.name',
      ])
      .getMany();
    }
  
    async findById(userId: number) {
      return this.userRepo.findOne({
        where: { id: userId },
        select: ['id', 'first_name', 'last_name', 'phone', 'email','username'],
      });
    }
  
    async findByPhone(phone: string) {
      return this.userRepo.findOne({
        where: { phone },
        select: ['id', 'username','first_name', 'last_name', 'phone', 'email'],
      });
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
    async findByEmailOrPhone(email?: string, phone?: string) {
      const conditions: { email?: string; phone?: string }[] = [];
      
      if (email) conditions.push({ email });
      if (phone) conditions.push({ phone });
      if (conditions.length === 0) return undefined;
      return this.userRepo.findOne({ where: conditions });
    }

    async update(userId: number, updateData: Partial<User>) {
      await this.userRepo.update(userId,updateData);
    }
  }
>>>>>>> dbcff1a7a316b8a7d11cc6482ede8438cd548b3b
