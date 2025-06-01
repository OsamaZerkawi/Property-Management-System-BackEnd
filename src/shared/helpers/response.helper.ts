export interface ApiResponse<T = any> {
    successful: boolean;
    message?: string;
    error?: string;
    data?: T;
    status_code: number;
  }
  
  export const successResponse = <T>(
    data: T,
    message = 'Request successful',
    statusCode = 200
  ): ApiResponse<T> => ({
    successful: true,
    message,
    data : data,
    status_code: statusCode,
  });
  
  export const errorResponse = (
    error = 'Something went wrong',
    statusCode = 500,
  ): ApiResponse<null> => ({
    successful: false,
    error,
    status_code: statusCode,
  });
