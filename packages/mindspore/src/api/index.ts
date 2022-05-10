import { request } from 'shared/plugins/axios';
import type { AxiosResponse } from 'shared/plugins/axios';

/**
 * 开源社区信息
 */

export const openCommunityInfo = {
  name: 'mindspore',
  link: 'https://www.mindspore.cn/',
  link_en: 'https://www.mindspore.cn/en',
  email: 'contact@mindspore.org',
};
/**
 * 查询社区贡献
 *
 */
export function queryAll() {
  const url = `query/all?community=${openCommunityInfo.name}`;
  return request.get(url).then((res: AxiosResponse) => res.data);
}
