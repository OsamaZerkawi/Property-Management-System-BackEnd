
import { applyDecorators, UseGuards } from '@nestjs/common';
import { MobileLocalAuthGuard } from '../guards/mobile-local.guard';

export function UseMobileAuthGuard() {
  return applyDecorators(UseGuards(MobileLocalAuthGuard));
}
