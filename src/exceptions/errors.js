export class SilencedError extends Error {
  constructor(message) {
    super(message);

    this.name = 'SilencedError';
    this.message = message;
    this.silenced = true;
  }
}
