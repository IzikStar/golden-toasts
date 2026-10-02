export type ApiError = {
  status?: number;
  data?: {
    message?: string;
  };
};

export type NetworkError = {
  status?: number;
  response?: {
    status?: number;
  };
  message?: string;
};

export type ErrorType = ApiError | NetworkError | Error | unknown;