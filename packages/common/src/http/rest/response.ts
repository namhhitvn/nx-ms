import { HttpStatus } from '../constant';

export class HttpRestResponse<Data> {
  public readonly data!: Data;
  public readonly message?: string;
  public readonly response?: Response;
  public readonly statusCode?: HttpStatus;

  constructor(data: Data, statusCode = HttpStatus.OK, message?: string) {
    (this as WithWritable<this>).data = data;
    (this as WithWritable<this>).message = message;

    Object.defineProperty(this, 'statusCode', {
      value: statusCode,
      enumerable: false,
    });
  }
}
