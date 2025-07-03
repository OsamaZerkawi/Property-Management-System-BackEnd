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

export class CreateUserDto {
  @IsNotEmpty({ message: 'الاسم الأول مطلوب' })
  @IsString({ message: 'الاسم الأول يجب أن يكون نص' })
  @MinLength(2, { message: 'الاسم الأول يجب أن يكون على الأقل حرفين' })
  @MaxLength(50, { message: 'الاسم الأول يجب أن يكون أقل من 50 حرف' })
  @Transform(({ value }) => value?.trim())
  first_name: string;

  @IsNotEmpty({ message: 'الاسم الأخير مطلوب' })
  @IsString({ message: 'الاسم الأخير يجب أن يكون نص' })
  @MinLength(2, { message: 'الاسم الأخير يجب أن يكون على الأقل حرفين' })
  @MaxLength(50, { message: 'الاسم الأخير يجب أن يكون أقل من 50 حرف' })
  @Transform(({ value }) => value?.trim())
  last_name: string;

  @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
  @IsString({ message: 'رقم الهاتف يجب أن يكون نص' }) 
  @Transform(({ value }) => value?.replace(/\s+/g, ''))
  phone: string;

  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
  @MaxLength(255, { message: 'البريد الإلكتروني طويل جداً' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @IsString({ message: 'كلمة المرور يجب أن تكون نص' })
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون على الأقل 8 أحرف' })
  @MaxLength(128, { message: 'كلمة المرور طويلة جداً' })
  //@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    //message: 'كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة ورقم ورمز خاص',
  //})
  password: string;

  @IsOptional()
   photo?: string;
}