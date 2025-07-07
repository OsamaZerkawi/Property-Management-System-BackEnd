import { applyDecorators } from '@nestjs/common';
import { LoginApiBody, LoginForbiddenResponse, LoginSuccessResponse, LoginValidationErrorResponse } from '../../auth/auth.swagger';

export function LoginSwaggerDoc() {
  return applyDecorators(
    LoginApiBody,
    LoginSuccessResponse,
    LoginValidationErrorResponse,
    LoginForbiddenResponse,
  );
}
