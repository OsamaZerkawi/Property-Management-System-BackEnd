 import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'البريد الإلكتروني للمستخدم',
    example: 'user@example.com',
  }) 
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  email: string;

  @ApiProperty({
    description: 'كلمة المرور الجديدة',
    example: 'newStrongPassword123',
    minLength: 8,
    maxLength: 128,
  })
  @IsNotEmpty({ message: 'كلمة المرور الجديدة مطلوبة' })
  @IsString({ message: 'كلمة المرور يجب أن تكون نصاً' })
  @MinLength(8, { message: 'كلمة المرور يجب ألا تقل عن 8 أحرف' })
  @MaxLength(128, { message: 'كلمة المرور طويلة جداً' })
  password: string;
}
