// src/application/use-cases/update-user-info.use-case.ts
import {
  Inject, Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import * as fs from 'fs';
import { User } from 'src/domain/entities/user.entity';
import { USER_REPOSITORY, UserRepositoryInterface } from 'src/domain/repositories/user.repository';
import * as path from 'path';
@Injectable()
export class UpdateUserInfoUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryInterface,
  ) {}

  async execute(
    userId: number,
    data: Partial<{ first_name: string; last_name: string; phone: string;photo:string }>, 
  ): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('المستخدم غير موجود');
  
    if (data.phone && data.phone !== user.phone) {
      const exists = await this.userRepo.findByPhone(data.phone);
      if (exists) throw new BadRequestException('رقم الهاتف مستخدم بالفعل');
    } 
    if (data.photo) { 
       if (user.photo) { 
        const oldPath = path.join( 'uploads', 'profile', user.photo);  
        if (fs.existsSync(oldPath)) { 
          fs.unlinkSync(oldPath);
        } 
    }
      data['photo'] = data.photo; 
    } 

  const partial: Partial<User> = {};
    if (data.first_name  != null) partial.first_name = data.first_name;
    if (data.last_name   != null) partial.last_name  = data.last_name;
    if (data.phone       != null) partial.phone     = data.phone;
    if (data.photo != null) partial.photo     = data.photo;
    
    await this.userRepo.update(userId, partial);

  }
}
