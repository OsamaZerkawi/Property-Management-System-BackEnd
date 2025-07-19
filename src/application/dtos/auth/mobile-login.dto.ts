import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class MobileLoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'البريد الإلكتروني' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'كلمة المرور' })
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  password: string;
}
