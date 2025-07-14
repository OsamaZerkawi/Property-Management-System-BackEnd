// src/presentation/http/swagger/docs/auth.swagger.ts

import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from 'src/application/dtos/auth/login.dto';

export const LoginApiBody = ApiBody({ 
  type: LoginDto,
  examples: {
    valid: {
      value: {
        username: 'hasanzaeter',
        password: 'securePassword123'
      }
    },
  }
});

export const LoginSuccessResponse = ApiResponse({
  status: 200,
  description: 'تم تسجيل الدخول بنجاح',
  schema: {
    example: {
      successful: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        user: {
          id: 1,
          first_name: 'hasan',
          last_name: 'zaeter',
          email: 'hzaeter04@gmail.com',
          role: 'صاحب مكتب',
          permissions: [] // أو مثال: ["create_post", "edit_post"]
        },
        tokens: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      },
      status_code: 200
    }
  }
});

export const LoginValidationErrorResponse = ApiResponse({
  status: 400,
  description: 'Validation error',
  schema: {
    example: {
      message: [
        'username should not be empty',
        'username must be a string',
        'password should not be empty',
        'password must be a string'
      ],
      error: 'Bad Request',
      statusCode: 400
    }
  }
});

export const LoginForbiddenResponse = ApiResponse({
  status: 401,
  description: 'Invalid credentials',
  schema: {
    example: {
      successful: false,
      error: 'Access Denied',
      status_code: 403
    }
  }
});

