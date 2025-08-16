import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiProperty({ example: 'كيف يمكنني إعادة تعيين كلمة المرور؟' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    example: 'اذهب إلى الإعدادات -> الأمان -> إعادة تعيين كلمة المرور',
  })
  @IsString()
  @IsNotEmpty()
  answer: string;
}
