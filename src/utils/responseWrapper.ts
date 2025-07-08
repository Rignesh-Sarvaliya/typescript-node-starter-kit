type SuccessResponse<T> = {
  status: true;
  message: string;
  data?: T;
};

type ErrorResponse<T> = {
  status: false;
  message: string;
  data?: T;
};

export const success = <T = any>(
  message: string,
  data?: T
): SuccessResponse<T> => ({
  status: true,
  message,
  data,
});

export const error = <T = any>(
  message: string,
  data?: T
): ErrorResponse<T> => ({
  status: false,
  message,
  data,
});
