import { request } from 'shared/plugins/axios';
import type { AxiosResponse } from 'shared/plugins/axios';

/**
 * 获取授权的相关回调链接
 */
/**
 * 开源社区信息
 */

export const openCommunityInfo = {
  name: 'openeuler',
  link: 'https://www.openeuler.org/zh/',
  link_en: 'https://www.openeuler.org/en/',
  email: 'contact@openeuler.sh',
};
/**
 * 查询社区贡献
 *
 */
export function queryAll() {
  const url = `query/all?community=${openCommunityInfo.name}`;
  return request.get(url).then((res: AxiosResponse) => res.data);
}

/**
 * 查询社区贡献
 */
export function queryCompanyContribute(params: object) {
  const url = 'query/company/contribute';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * 查询个人贡献
 *
 */
export function queryUserContribute(params: object) {
  const url = 'query/user/contribute';
  return request.get(url, { params }).then((res: AxiosResponse) => res.data);
}
/**
 * 查询组织活跃度
 *
 */
export function queryGroupActive() {
  const url = 'query/group/Active';
  return request.get(url).then((res: AxiosResponse) => res.data);
}
