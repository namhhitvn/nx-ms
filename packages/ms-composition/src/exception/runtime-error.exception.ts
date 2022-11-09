import { HttpStatus } from '@nx-ms/common/src/http/constant';

export class RuntimeErrorException extends Error {
  public readonly statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

  constructor(message = '', stack?: string | string[]) {
    super(message);
    this.name = this.constructor.name;
    if (stack) this.stack = Array.isArray(stack) ? stack.join('\n') : stack;
  }

  public what() {
    return this.message;
  }
}
