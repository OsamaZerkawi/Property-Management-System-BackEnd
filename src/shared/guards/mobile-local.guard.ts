// src/infrastructure/auth/guards/mobile-local.guard.ts
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class MobileLocalAuthGuard extends AuthGuard('mobile-local') {}
