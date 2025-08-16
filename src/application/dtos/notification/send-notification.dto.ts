import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';
import { NotificationSender } from 'src/domain/enums/notification-sender.enum';

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


  @ApiProperty({
    description: 'المستهدفين',
    enum: NotificationSender,
    example:NotificationSender.ADMINS
  })
  @IsEnum(NotificationSender)
  target: NotificationSender;

  // @ApiPropertyOptional({
  //   description: 'رمز FCM خاص بالجهاز (اختياري)',
  //   example: 'd7gh98sd98f7sd9f7sd9f',
  // })
  // @IsOptional()
  // @IsString()
  // fcmToken?: string;
}
