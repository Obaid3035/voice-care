/**
 * Simple HTTP Error Classes for API Error Handling
 * Provides standardized error classes for different HTTP status codes
 */

import { STANDARD } from '../constants/request';

// Base HTTP Error class
export class HttpError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

// 400 Bad Request
export class BadRequest extends HttpError {
  constructor(message: string) {
    super(message, STANDARD.BAD_REQUEST);
  }
}

// 401 Unauthorized
export class Unauthorized extends HttpError {
  constructor(message: string = 'Authentication failed') {
    super(message, STANDARD.UNAUTHORIZED);
  }
}

// 403 Forbidden
export class Forbidden extends HttpError {
  constructor(message: string = 'Access denied') {
    super(message, STANDARD.FORBIDDEN);
  }
}

// 404 Not Found
export class NotFound extends HttpError {
  constructor(message: string = 'Resource not found') {
    super(message, STANDARD.NOT_FOUND);
  }
}

// 409 Conflict
export class Conflict extends HttpError {
  constructor(message: string) {
    super(message, STANDARD.CONFLICT);
  }
}

// 422 Unprocessable Entity
export class UnprocessableEntity extends HttpError {
  constructor(message: string) {
    super(message, STANDARD.UNPROCESSABLE_ENTITY);
  }
}

// 500 Internal Server Error
export class InternalServerError extends HttpError {
  constructor(message: string = 'Internal server error') {
    super(message, STANDARD.INTERNAL_SERVER_ERROR);
  }
}

// 503 Service Unavailable
export class ServiceUnavailable extends HttpError {
  constructor(message: string = 'Service unavailable') {
    super(message, STANDARD.SERVICE_UNAVAILABLE);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Resource not found') {
    super(message, STANDARD.NOT_FOUND);
  }
}
