import { request } from '@/service/axios';

export function queryInfo(url) {
  return request.get(url);
}
