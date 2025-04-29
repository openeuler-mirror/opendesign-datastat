import { AxiosResponse, request } from '../plugins/axios';

export interface ResType<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * 查询社区贡献
 */
export function queryCompanyContribute(params: object) {
  const url = '/stat/company/contribute';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * 查询个人贡献
 *
 */
export function queryUserContribute(params: object) {
  const url = '/stat/user/contribute';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 *个人社区用户列表
 */
export function queryUserList(params: object) {
  const url = '/stat/userlist';
  return request.get(url, { params, global: true }).then((res: AxiosResponse) => res.data);
}
/**
 * 开发者详情页面查询个人全部贡献数量
 */
export function queryUserContributeCounts(params: object) {
  const url = '/stat/count';
  return request.get(url, { params, global: true }).then((res: AxiosResponse) => res.data);
}
/**
 *个人sig组明细
 */
export function queryUserSigContribute(params: object) {
  const url = '/stat/sigcontribute';
  return request.get(url, { params, global: true }).then((res: AxiosResponse) => res.data);
}

/**
 *个人贡献详情
 */
export function queryUserContributeDetails(params: object, contributeType: string) {
  const url = `/stat/${contributeType}/detail`;
  return request.get(url, { params, global: true }).then((res: AxiosResponse) => res.data);
}
/**
 * sig用户的个人贡献
 */
export function querySigUserContribute(params: object) {
  const url = '/stat/sig/user/contribute';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * 获取gauss所有的repos
 *
 */
export function queryCoreRepos(name: string) {
  const url = `/stat/repo?community=${name}`;
  return request.get(url).then((res: AxiosResponse) => res.data);
}

export function getOverviewContributeData(community: string) {
  const url = `/stat/overview/contribute?community=${community}`;
  return request.get<ResType<{ pr: number; issue: number; comment: number }>>(url).then((res) => res.data);
}

export function getOverviewOrgMemberCount(community: string) {
  const url = `/stat/overview/company?community=${community}`;
  return request.get<ResType<{ partner: number }>>(url).then((res) => res.data);
}

export function getOverviewContributorCount(community: string) {
  const url = `/stat/overview/contributor?community=${community}`;
  return request.get<ResType<{ contributor: number }>>(url).then((res) => res.data);
}

export function getOverviewSigCount(community: string) {
  const url = `/stat/overview/sig?community=${community}`;
  return request.get<ResType<{ sig: number }>>(url).then((res) => res.data);
}
