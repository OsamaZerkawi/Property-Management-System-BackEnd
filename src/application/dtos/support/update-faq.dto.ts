import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateFaqDto {
  @ApiProperty({ example: 'كيف يمكنني إعادة تعيين كلمة المرور؟' })
  @IsString()
  @IsOptional()
  question?: string;

  @ApiProperty({
    example: 'اذهب إلى الإعدادات -> الأمان -> إعادة تعيين كلمة المرور',
  })
  @IsString()
  @IsOptional()
  answer?: string;
}
