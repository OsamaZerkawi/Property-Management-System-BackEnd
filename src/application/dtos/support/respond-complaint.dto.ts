import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum } from 'class-validator';
import { ComplaintType } from 'src/domain/enums/complaint-type.enum';

export class RespondToComplaintDto {
  @ApiProperty({
    description: 'قبول أو رفض الشكوى',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  approved: boolean;

  @ApiProperty({
    description: 'نوع الجهة التي تم الرد منها (مزود خدمة أو مكتب)',
    enum: ComplaintType,
    example: ComplaintType.SERVICE_PROVIDER,
  })
  @IsEnum(ComplaintType)
  type: ComplaintType;
}
