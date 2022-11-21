import { HttpRestResponse } from './response';

export class GetByIdRestRequestParams {
  public id!: string;
}

export class GetBySlugRestRequestParams {
  public slug!: string;
}

export class GetByIdOrSlugRestRequestParams {
  public idOrSlug!: string;
}

export interface RestRequestResponseOKData {
  ok: boolean;
}

export class RestRequestResponseOK extends HttpRestResponse<RestRequestResponseOKData> {
  constructor(data: RestRequestResponseOKData = { ok: true }) {
    super(data);
  }
}
