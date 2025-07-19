export interface ApiResponse<T = any> {
  successful: boolean;
  message?: string;
  error?: string;
  data?: T;
  status_code: number;
}

export interface PaginatedApiResponse<T> {
  successful: boolean;
  message: string;
  data: T;
  status_code: number;
  pagination: {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
  };
}

export const successPaginatedResponse = <T>(
  data: T,
  totalItems: number,
  currentPage: number,
  itemsPerPage: number,
  message = 'Request successful',
  statusCode = 200
): PaginatedApiResponse<T> => ({
  successful: true,
  message,
  data,
  status_code: statusCode,
  pagination: {
    currentPage,
    totalItems,
    itemsPerPage,
    totalPages: Math.ceil(totalItems / itemsPerPage),
  },
});


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
  message = 'Something went wrong',
  statusCode = 500,
): ApiResponse<null> => ({
  successful: false,
  message,
  status_code: statusCode,
});
