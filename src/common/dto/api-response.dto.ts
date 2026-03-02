export class ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
  error?: string;

  static success<T>(
    data: T,
    message: string,
    statusCode = 200,
  ): ApiResponse<T> {
    const response = new ApiResponse<T>();
    response.success = true;
    response.message = message;
    response.statusCode = statusCode;
    response.data = data;
    return response;
  }

  static error(
    message: string,
    statusCode: number,
    error?: string,
  ): ApiResponse {
    const response = new ApiResponse();
    response.success = false;
    response.message = message;
    response.statusCode = statusCode;
    response.error = error;
    return response;
  }
}
