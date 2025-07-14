import { BadRequestException, Inject, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateAdminDto } from "src/application/dtos/auth/create-admin.dto";
import { RoleRepository } from "src/infrastructure/repositories/role.repository";
import { UserRepository } from "src/infrastructure/repositories/user.property";
import { errorResponse } from "src/shared/helpers/response.helper";
import * as generatePassword from 'generate-password';
import * as bcrypt from 'bcrypt';
import { MailService } from "src/application/services/mail.service";
import { USER_REPOSITORY, UserRepositoryInterface } from "src/domain/repositories/user.repository";
import { ROLE_REPOSITORY, RoleRepositoryInterface } from "src/domain/repositories/role.repository";
import { PERMISSION_REPOSITORY, PermissionRepositoryInterface } from "src/domain/repositories/permission.repository";
import { User } from "src/domain/entities/user.entity";
import { da } from "@faker-js/faker/.";

export class CreateAdminUseCase {
    constructor(
      @Inject(USER_REPOSITORY)
      private readonly userRepo: UserRepositoryInterface,
      @Inject(ROLE_REPOSITORY)
      private readonly roleRepo: RoleRepositoryInterface,
      @Inject(PERMISSION_REPOSITORY)
      private readonly permissionRepo: PermissionRepositoryInterface,

      private readonly mailService: MailService,
    ){}

    async execute(data: CreateAdminDto){
        const userExists = await this.userRepo.findByEmailOrPhone(data.email,data.phone);

        if(userExists){
            throw new BadRequestException(
                errorResponse('يوجد مستخدم مسجل مسبقًا بنفس البريد الإلكتروني أو رقم الهاتف.',400)
            );
        }

        // generate password for admin
        const rawPassword = generatePassword.generate({
           length: 8,
           numbers: true,
           uppercase: true,
           lowercase: true,
           symbols: false,
           excludeSimilarCharacters: true,
        });

        const hashedPassword = await bcrypt.hash(rawPassword,10);

        const user = await this.userRepo.save({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            password:hashedPassword,
        } as User);

        // generate username for admin
        const baseUsername = `${data.first_name} ${data.last_name}`;
        const finalUsername = `${baseUsername}-${user.id}`;

        // update username for admin
        await this.userRepo.update(user.id,{
            username: finalUsername,
        });

        // assign role to user
        const role = await this.roleRepo.findByName('مشرف');
        if(!role){ 
            throw new NotFoundException(
                errorResponse('الدور مشرف غير موجود',404)
            );
        }
        await this.roleRepo.assignRoleToUser(user.id,role.id);

        // assign permission to admin
        const permissions = await this.permissionRepo.findByIds(data.permissionIds);

        await this.permissionRepo.assignPermissionsToUser(user.id,permissions);

        try {
          await this.mailService.sendAdminCredentials(data.email, finalUsername, rawPassword);
        } catch (error) {
          throw new InternalServerErrorException(
            errorResponse('تم إنشاء الحساب ولكن فشل إرسال بيانات الدخول عبر البريد.',500)
          );
        }        
    }
}