export class HttpRestResponse<Data> {
  public readonly data!: Data;
  public readonly message?: string;
  public readonly response?: Response;

  constructor(data: Data, message?: string) {
    (this as WithWritable<this>).data = data;
    (this as WithWritable<this>).message = message;
  }
}
