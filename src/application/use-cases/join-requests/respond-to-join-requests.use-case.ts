import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { respondToJoinRequestsDto } from "src/application/dtos/auth/respond-to-join-request.dto";
import { AdminAgreement } from "src/domain/enums/admin-agreement.enum";
import { JOIN_REQUEST_REPOSITORY, JoinRequestRepositoryInterface } from "src/domain/repositories/join-requests.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import * as generatePassword from 'generate-password';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY, UserRepositoryInterface } from "src/domain/repositories/user.repository";
import { User } from "src/domain/entities/user.entity";
import { ROLE_REPOSITORY, RoleRepositoryInterface } from "src/domain/repositories/role.repository";
import { MailService } from "src/application/services/mail.service";
import { Admin } from "typeorm";
import { join } from "path";

@Injectable()
export class RespondToJoinRequestUseCase {
    constructor(
        @Inject(JOIN_REQUEST_REPOSITORY)
        private readonly joinRequestRepo: JoinRequestRepositoryInterface,
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepositoryInterface,
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepo: RoleRepositoryInterface,
        private readonly mailService: MailService,
    ){}

    async execute(id: number,data: respondToJoinRequestsDto){
        const joinRequest = await this.joinRequestRepo.findById(id);
        if(!joinRequest){
            throw new NotFoundException(
                errorResponse('الطلب غير موجود',404)  
            );
        }

        if(data.approved){
            await  this.joinRequestRepo.updateStatus(id,{
                admin_agreement: AdminAgreement.APPROVED
            });

            const username = `${joinRequest.first_name}-${joinRequest.last_name}-${joinRequest.id}`;
            const rawPassword = generatePassword.generate({
               length: 8,
               numbers: true,
               uppercase: true,
               lowercase: true,
               symbols: false,
               excludeSimilarCharacters: true,
            });

            const hashedPassword = await bcrypt.hash(rawPassword,10);

            const userExist = await this.userRepo.findByEmail(joinRequest.email);

            if(userExist){
                throw new BadRequestException(
                    errorResponse('يوجد مستخدم مسجل مسبقًا بنفس البريد الإلكتروني أو رقم الهاتف.',400)
                );
            }
            const user = await this.userRepo.save({
                first_name: joinRequest.first_name,
                last_name: joinRequest.last_name,
                username,
                email: joinRequest.email,
                password:hashedPassword,
            } as User);

            const role = await this.roleRepo.findByName(joinRequest.agent_type);

            if(!role){ 
                throw new NotFoundException(
                    errorResponse('الدور  غير موجود',404)
                );
            }

            await this.roleRepo.assignRole(user,role);

            this.mailService.sendJoinRequestApproval(
                joinRequest.email,
                joinRequest.first_name,
                joinRequest.last_name,
                username,
                rawPassword,
                joinRequest.agent_type
            )
            return 'تم قبول الطلب وإرسال بيانات الدخول بنجاح';
        }else {
            if(!data.reason?.trim()){
                throw new BadRequestException(
                    errorResponse('سبب الرفض مطلوب',400)
                );
            }

            await  this.joinRequestRepo.updateStatus(id,{
                admin_agreement: AdminAgreement.REJECTED
            });

            this.mailService.sendJoinRequestRejection(
                joinRequest.email,
                joinRequest.first_name,
                joinRequest.last_name,
                data.reason,
                joinRequest.agent_type                
            )
            return 'تم رفض الطلب وإرسال إشعار للمستخدم';  
        }
    }
}