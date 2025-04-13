type SuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

type ErrorResponse = {
  success: false;
  message: string;
  errors?: any;
};

export const success = <T = any>(
  data: T,
  message?: string
): SuccessResponse<T> => ({
  success: true,
  data,
  message,
});

export const error = (message: string, errors?: any): ErrorResponse => ({
  success: false,
  message,
  errors,
});
