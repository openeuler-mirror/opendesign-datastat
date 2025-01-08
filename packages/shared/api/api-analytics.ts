import { request } from '../plugins/axios';

export function reportAnalytics(app: string, data: Record<string, any>) {
  return request.post(`/api-dsapi/query/track/${app}`, data, {
    ignoreError: true,
  });
}
