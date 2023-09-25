export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
  // esse n ta servindo para nada ^^
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404);
  }
  // esse n ta servindo para nada ^^
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401);
  }
}
