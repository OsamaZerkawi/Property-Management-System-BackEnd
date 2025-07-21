import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({
    description: 'عنوان الإشعار',
    example: 'تنبيه جديد',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'محتوى الإشعار',
    example: 'تم إضافة عنصر جديد في النظام',
  })
  @IsString()
  body: string;

  
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'رمز FCM خاص بالجهاز (اختياري)',
    example: 'd7gh98sd98f7sd9f7sd9f',
  })
  @IsOptional()
  @IsString()
  fcmToken?: string;
}
