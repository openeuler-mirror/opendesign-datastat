import { AxiosResponse, request } from "shared/plugins/axios";

interface FeedBackQueryT {
  feedbackPageUrl: string;
  feedbackText: string;
  feedbackValue: number;
}
/**
 * 满意度评分
 * @param {FeedBackQueryT} params
 * @return {Object}
 */
export function postFeedback(params: FeedBackQueryT): Promise<{
  code: number;
  data: string;
  msg: string;
  update_at: string;
}> {
  const url = '/api-dsapi/query/nps?community=openeuler';
  return request.post(url, params).then((res: AxiosResponse) => res.data);
}