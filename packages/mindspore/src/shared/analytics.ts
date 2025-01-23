import { OpenAnalytics } from '@opensig/open-analytics';
import { OAUtil } from 'shared/analytics';
import { reportAnalytics } from 'shared/api/api-analytics';

class MindSporeOa extends OAUtil {
  oa?: OpenAnalytics;

  getInstance(): OpenAnalytics {
    if (!this.oa) {
      this.oa = new OpenAnalytics({
        appKey: 'MindSpore',
        request: (data) => {
          reportAnalytics('mindspore', data);
        },
      });
      this.oa.setHeader({ service: 'datastat' });
    }
    return this.oa;
  }
}

const oa = new MindSporeOa();
export default oa;
