import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  Length,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';  
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'الاسم الأول للمستخدم',
    example: 'حسن',
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'الاسم الأول مطلوب' })
  @IsString({ message: 'الاسم الأول يجب أن يكون نص' })
  @MinLength(2, { message: 'الاسم الأول يجب أن يكون على الأقل حرفين' })
  @MaxLength(50, { message: 'الاسم الأول يجب أن يكون أقل من 50 حرف' })
  @Transform(({ value }) => value?.trim())
  first_name: string;

  @ApiProperty({
    description: 'الاسم الأخير للمستخدم',
    example: 'زعيتر',
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'الاسم الأخير مطلوب' })
  @IsString({ message: 'الاسم الأخير يجب أن يكون نص' })
  @MinLength(2, { message: 'الاسم الأخير يجب أن يكون على الأقل حرفين' })
  @MaxLength(50, { message: 'الاسم الأخير يجب أن يكون أقل من 50 حرف' })
  @Transform(({ value }) => value?.trim())
  last_name: string;

  @ApiProperty({
    description: 'رقم الهاتف الخاص بالمستخدم',
    example: '0987654321',
  })
  @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
  @IsString({ message: 'رقم الهاتف يجب أن يكون نص' }) 
  @Transform(({ value }) => value?.replace(/\s+/g, ''))
  phone: string;

  @ApiProperty({
    description: 'البريد الإلكتروني',
    example: 'hassan@example.com',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
  @MaxLength(255, { message: 'البريد الإلكتروني طويل جداً' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'كلمة المرور (8 إلى 128 حرفاً)',
    example: 'StrongPass123!',
    minLength: 8,
    maxLength: 128,
  })
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @IsString({ message: 'كلمة المرور يجب أن تكون نص' })
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون على الأقل 8 أحرف' })
  @MaxLength(128, { message: 'كلمة المرور طويلة جداً' }) 
  password: string;

  @ApiPropertyOptional({
    description: 'صورة الملف الشخصي (اختياري، يتم رفعها بصيغة ملف)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
   photo?: string;
}