import { request } from '../plugins/axios';
import type { AxiosResponse } from '../plugins/axios';

/**
 * 获取授权的相关回调链接
 */
export function queryCourse(params: object) {
  const url = '/authing/user/permission';
  return request
    .get(url, { params, global: true })
    .then((res: AxiosResponse) => res.data);
}
/**
 * 获取授权token链接
 */
export function queryToken(params: object) {
  const url = '/authing/token/apply';
  return request
    .get(url, { params, global: true })
    .then((res: AxiosResponse) => res.data);
}
/**
 * 获取idtoken用于退出
 */
export function queryIDToken() {
  const url = '/authing/logout';
  return request.get(url).then((res: AxiosResponse) => res.data);
}
/**
 * 获取指定sig活跃度及排名
 */
export function getSigScore(params: object) {
  const url = '/query/sig/score';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}

/**
 * 获取指定sig雷达图
 */
export function getSigRadarScore(params: object) {
  const url = '/query/sig/radarscore';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}

/**
 * 查询社区贡献
 *
 */
export function queryAll(name: string) {
  const url = `/query/all?community=${name}`;
  return request.get(url).then((res: AxiosResponse) => res.data);
}

/**
 * 查询社区贡献
 */
export function queryCompanyContribute(params: object) {
  const url = '/query/company/contribute';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * 查询个人贡献
 *
 */
export function queryUserContribute(params: object) {
  const url = '/query/user/contribute';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}

/**
 * 查询sig名称
 *
 */
export function querySigName(name: string) {
  const url = `/query/sig/name?community=${name}`;
  return request.get(url).then((res: AxiosResponse) => res.data);
}

/**
 * 查询sig repos
 */
export function querySigRepos(params: object) {
  const url = '/query/sig/repo';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * sig活跃度及排名
 *
 */
export function querySigScores(params: object) {
  const url = '/query/sig/sigcsores';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * sig指标
 *
 */
export function querySigDetail(params: object) {
  const url = '/query/sig/sigdetails';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * 所有sig活跃度及排名
 */
export function queryAllSigScores(params: object) {
  const url = '/query/sig/allsigdetails';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * sig用户的个人贡献
 */
export function querySigUserContribute(params: object) {
  const url = '/query/sig/usercontribute';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * 社区名字
 */
export function queryCompanyName(name: string) {
  const url = `/query/company/name?community=${name}`;
  return request.get(url).then((res: AxiosResponse) => res.data);
}
/**
 * 社区成员的个人贡献
 */
export function queryCompanyUserContribute(params: object) {
  const url = '/query/company/usercontribute';
  return request
    .get(url, { params, global: true })
    .then((res: AxiosResponse) => res.data);
}
/**
 * 社区成员参与的sig的各项指标
 */
export function queryCompanySigDetails(params: object) {
  const url = '/query/company/sigdetails';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}

/**
 * 企业投入的贡献者数量
 */
export function queryCompanyUsers(params: object) {
  const url = '/query/company/users';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * 特别兴趣小组活跃度
 */
export function querySigScoreAll(params: object) {
  const url = '/query/sig/scoreAll';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}

/**
 * 企业和sig的贡献关系
 */
export function queryCompanySigs(params: object) {
  const url = '/query/company/sigs';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}

/**
 * 获取所有的repos
 *
 */
export function queryRepos(name: string) {
  const url = `/query/community/repos?community=${name}`;
  return request.get(url).then((res: AxiosResponse) => res.data);
}

/**
 * sig侧边栏详情
 */
export function querySigInfo(params: object) {
  const url = '/query/sig/info';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}

/**
 * sig下公司贡献
 */
export function querySigCompanyContribute(params: object) {
  const url = '/query/sig/company/contribute';
  return request
    .get(url, { params, global: true })
    .then((res: AxiosResponse) => res.data);
}
/**
 *TC组成员所管理的sig组列表
 */
export function queryTCSigs(params: object) {
  const url = '/query/TC/sigs';
  return request
    .get(url, { params, global: true })
    .then((res: AxiosResponse) => res.data);
}
