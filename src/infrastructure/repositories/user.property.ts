import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/domain/entities/user.entity";
import { UserRepositoryInterface } from "src/domain/repositories/user.repository";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository implements UserRepositoryInterface {
    constructor(
      @InjectRepository(User)
      private readonly userRepo: Repository<User>,
    ) {}
  
    async findById(userId: number) {
      return this.userRepo.findOne({
        where: { id: userId },
        select: ['id', 'first_name', 'last_name', 'phone', 'email'],
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
  }