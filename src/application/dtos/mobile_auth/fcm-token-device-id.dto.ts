import { IsOptional, IsString, Length } from 'class-validator';

export class MobileLoginWithDeviceDto { 
  @IsOptional()
  @IsString() 
  device_id?: string;

  @IsOptional()
  @IsString() 
  fcm_token?: string;
 
}
