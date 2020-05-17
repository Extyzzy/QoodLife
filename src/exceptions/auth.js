import { SilencedError } from "./errors";

export class InvalidRefreshToken extends SilencedError {
  constructor(message = 'Invalid refresh token.') {
    super(message);

    this.name = 'InvalidRefreshToken';
    this.message = message;
  }
}

export class UndefinedAccessToken extends SilencedError {
  constructor(message = 'Undefined access token.') {
    super(message);

    this.name = 'UndefinedAccessToken';
    this.message = message;
  }
}
