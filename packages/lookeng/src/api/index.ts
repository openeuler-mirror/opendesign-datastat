import { request } from 'shared/plugins/axios';
import type { AxiosResponse } from 'shared/plugins/axios';

/**
 * 开源社区信息
 */

export const openCommunityInfo = {
  name: 'openlookeng',
  link: 'https://openlookeng.io/zh-cn/',
  link_en: 'https://openlookeng.io/',
  email: 'contact@openlookeng.io',
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
