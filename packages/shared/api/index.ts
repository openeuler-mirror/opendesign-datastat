import { request } from '../plugins/axios';
import type { AxiosResponse } from '../plugins/axios';

/**
 * 查询sig名称
 *
 */
export function querySigName(name: string) {
  const url = `query/sig/name?community=${name}`;
  return request.get(url).then((res: AxiosResponse) => res.data);
}

/**
 * 查询sig repos
 */
export function querySigRepos(params: object) {
  const url = 'query/sig/repo';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * sig活跃度及排名
 *
 */
export function querySigScores(params: object) {
  const url = 'query/sig/sigcsores';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * sig指标
 *
 */
export function querySigDetail(params: object) {
  const url = 'query/sig/sigdetails';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * 所有sig活跃度及排名
 */
export function queryAllSigScores(params: object) {
  const url = 'query/sig/allsigdetails';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * sig用户的个人贡献
 */
export function querySigUserContribute(params: object) {
  const url = 'query/sig/usercontribute';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * 社区名字
 */
export function queryCompanyName(name: string) {
  const url = `query/company/name?community=${name}`;
  return request.get(url).then((res: AxiosResponse) => res.data);
}
/**
 * 社区成员的个人贡献
 */
export function queryCompanyUserContribute(params: object) {
  const url = 'query/company/usercontribute';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * 社区成员参与的sig的各项指标
 */
export function queryCompanySigDetails(params: object) {
  const url = 'query/company/sigdetails';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
