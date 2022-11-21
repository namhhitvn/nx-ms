import { BaseModelAudit } from '@nx-ms/common/src/model/base.model';

export class Todo extends BaseModelAudit {
  public title!: string;
  public active!: boolean;
}
