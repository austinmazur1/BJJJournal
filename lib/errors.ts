export class AppError extends Error {
    constructor(
      message: string,
      public statusCode: number = 500,
      public code?: string,
      public details?: unknown
    ) {
      super(message)
      this.name = this.constructor.name
      Error.captureStackTrace(this, this.constructor)
    }
  }
  
  export class ValidationError extends AppError {
    constructor(message: string, details?: unknown) {
      super(message, 400, 'VALIDATION_ERROR', details)
    }
  }
  
  export class AuthenticationError extends AppError {
    constructor(message: string = 'Unauthorized') {
      super(message, 401, 'AUTHENTICATION_ERROR')
    }
  }
  
  export class AuthorizationError extends AppError {
    constructor(message: string = 'Forbidden') {
      super(message, 403, 'AUTHORIZATION_ERROR')
    }
  }
  
  export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
      super(`${resource} not found`, 404, 'NOT_FOUND')
    }
  }
  
  export class ConflictError extends AppError {
    constructor(message: string) {
      super(message, 409, 'CONFLICT_ERROR')
    }
  }
  
  export class DatabaseError extends AppError {
    constructor(message: string = 'Database operation failed', details?: unknown) {
      super(message, 500, 'DATABASE_ERROR', details)
    }
  }