import { applyDecorators } from "@nestjs/common";
import { JwtAuthUnauthorizedResponse, LogoutSuccessResponse } from "../../auth/logout.swagger";
import { ApiBearerAuth } from "@nestjs/swagger";


export function LogoutSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth(), 
    LogoutSuccessResponse,
    JwtAuthUnauthorizedResponse,
  );
}