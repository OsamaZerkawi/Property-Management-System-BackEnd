import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { AgentType } from 'src/domain/enums/agent-type.enum';

export class RegisterSubscriberDto {
  @ApiProperty({
    enum: AgentType,
    description: 'نوع الوسيط (مكتب / مزود خدمة)',
  })
  @IsEnum(AgentType)
  agent_type: AgentType;

  @ApiProperty({ example: 'محمد', description: 'الاسم الأول' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'أحمد', description: 'اسم العائلة' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 24.774265, description: 'خط العرض (latitude)' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 46.738586, description: 'خط الطول (longitude)' })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'البريد الإلكتروني',
  })
  @IsEmail()
  email: string;

  proof_document?: string;
}
