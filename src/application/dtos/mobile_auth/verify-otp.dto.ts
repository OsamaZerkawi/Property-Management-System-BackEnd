import { IsString, IsEmail, IsOptional, IsNotEmpty,Length,Matches,IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';  
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'البريد الإلكتروني المستخدم للتسجيل',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
   //@IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
  //@Transform(({ value }) => value?.toLowerCase().trim())
  email: string;
  
  @ApiProperty({
    description: 'رمز التحقق المرسل إلى البريد (4 أرقام)',
    example: '1234',
  })
  @IsNotEmpty({ message: 'رمز التحقق مطلوب' })
  //@IsString({ message: 'رمز التحقق يجب أن يكون نص' })
  //@Length(4, 4, { message: 'رمز التحقق يجب أن يكون 4 أرقام' })
  //@Matches(/^\d{4}$/, { message: 'رمز التحقق يجب أن يحتوي على أرقام فقط' })
  otp: string;
 
}