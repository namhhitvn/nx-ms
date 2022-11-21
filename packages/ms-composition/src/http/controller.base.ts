import { isPromise } from 'util/types';
import { MSCore } from '../interfaces';

export abstract class BaseController<
  Params extends MSCore.RequestHandlerParameters<
    any,
    any,
    any,
    any,
    any,
    any
  > = MSCore.RequestHandlerParameters<any, any, any, any, any, any>,
  Response = any
> {
  protected req: Params[0];
  protected res: Params[1];
  protected next: Params[2];

  constructor(...[req, res, next]: Params) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  public abstract handle(): PromiseAble<void>;

  protected response(val: PromiseAble<Response>): PromiseAble<void> {
    if (isPromise(val)) {
      return val.then((res) => {
        this.res.json(res);
      });
    }

    this.res.json(val);
  }
}
