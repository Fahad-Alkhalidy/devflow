import { error } from "console";

export class RequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;
  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "RequestError";
  }
}

export class ValidationError extends RequestError {
  constructor(fieldErrors: Record<string, string[]>) {
    super(400, "Validation Error", fieldErrors);
    const message = ValidationError.formatMessage(fieldErrors);
    this.errors = fieldErrors;
  }
  static formatMessage(errors: Record<string, string[]>): string {
    const formattedErrors = Object.entries(errors).map(([field, messages]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      if (messages[0] === "Required") {
        return `${fieldName} is required.`;
      } else {
        return messages.join(" and ");
      }
    });
    return formattedErrors.join(" ");
  }
}

export class NotFoundError extends RequestError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends RequestError {
  constructor(message: string = "Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}
