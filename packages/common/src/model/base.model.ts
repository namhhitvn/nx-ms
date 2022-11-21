export class BaseModel {
  public _id: string | null = null;
}

export class BaseModelAudit extends BaseModel {
  public createdAt: Date | null = null;
  public updatedAt: Date | null = null;
  public deletedAt: Date | null = null;
}

