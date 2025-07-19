import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';
import { OtpType } from 'src/domain/entities/otp.entity';

export class ResendOtpDto {
  @ApiProperty({
    description: 'البريد الإلكتروني لإعادة إرسال رمز التحقق إليه',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  email: string;

  @ApiProperty({
    description: 'نوع رمز التحقق، إما "signup" للتسجيل أو "reset" لإعادة تعيين كلمة المرور',
    example: 'signup',
    enum: ['signup', 'reset'],
  })
  @IsNotEmpty()
  @IsIn(['signup', 'reset'], { message: 'نوع OTP يجب أن يكون signup أو reset' })  
  type: OtpType;
}