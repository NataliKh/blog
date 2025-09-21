export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const assert = (condition: unknown, statusCode: number, message: string): void => {
  if (!condition) {
    throw new ApiError(statusCode, message);
  }
};
