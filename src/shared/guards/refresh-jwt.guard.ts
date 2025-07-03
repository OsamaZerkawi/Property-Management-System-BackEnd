import { Injectable,UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { errorResponse} from "src/shared/helpers/response.helper";


@Injectable()
export class RefreshJwtGuard extends AuthGuard('jwt-refresh'){
  handleRequest(err: any, user: any, info: any) { 
    if (err || !user) {
      const message =
        info?.name === 'TokenExpiredError'
          ? 'رمز التحديث منتهي الصلاحية'
          : 'رمز التحديث غير صالح';

      throw new UnauthorizedException(
        errorResponse(message,401)
      );
    }

    return user;
  }
}


