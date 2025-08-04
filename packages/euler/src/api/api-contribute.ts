import { AxiosResponse, request } from "shared/plugins/axios";

export function queryCompanyContribute(params: object) {
  const url = '/api-magic/stat/version/company/contribute';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}