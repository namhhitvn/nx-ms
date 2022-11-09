import { HttpStatus } from '@nx-ms/common/src/http/constant';
import { RuntimeErrorException } from './runtime-error.exception';

export class InternalServerErrorException extends RuntimeErrorException {
  public override readonly statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
}
