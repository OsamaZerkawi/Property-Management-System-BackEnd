import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';
import { OtpType } from 'src/domain/entities/otp.entity';

export class ResendOtpDto {
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  email: string;

  @IsNotEmpty()
  @IsIn(['signup', 'reset'], { message: 'نوع OTP يجب أن يكون signup أو reset' })  
  type: OtpType;
}