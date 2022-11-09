import { RuntimeErrorException } from './runtime-error.exception';
import { HttpStatus } from '@nx-ms/common/src/http/constant';

export class FatalErrorException extends RuntimeErrorException {
  public override readonly statusCode: number = HttpStatus.NOT_IMPLEMENTED;
}
