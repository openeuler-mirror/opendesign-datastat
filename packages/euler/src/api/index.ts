import { request } from 'shared/plugins/axios';

export * from './api-contribute'

/**
 * 获取授权的相关回调链接
 */
/**
 * 开源社区信息
 */

export const openCommunityInfo = {
  name: 'openeuler',
  link: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/`,
  link_en: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/`,
  email: 'contact@openeuler.io',
};

export const getSigInfo = (sig: string) => {
  return request.get('/api-magic/stat/sig/info', { params: { community: 'openeuler', sig } })
    .then(res => res.data ?? {});
}
