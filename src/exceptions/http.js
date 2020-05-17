import { SilencedError } from "./errors";

export class Unauthorized extends SilencedError {
  constructor(message = 'Unauthorized.') {
    super(message);

    this.name = 'Unauthorized';
    this.message = message;
    this.code = 401;
  }
}

export class UnprocessableEntity extends SilencedError {
  constructor(message = 'Unprocessable Entity.') {
    super(message);

    this.name = 'UnprocessableEntity';
    this.message = message;
    this.code = 422;
  }
}

export class InternalServerError extends SilencedError {
  constructor(message = 'Internal Server Error.') {
    super(message);

    this.name = 'InternalServerError';
    this.message = message;
    this.code = 500;
  }
}
