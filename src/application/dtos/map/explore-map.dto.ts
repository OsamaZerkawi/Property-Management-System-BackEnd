import { IsNumber } from "class-validator";

export class ExploreMapDto {
  @IsNumber() minLat: number;
  @IsNumber() maxLat: number;
  @IsNumber() minLng: number;
  @IsNumber() maxLng: number;
}