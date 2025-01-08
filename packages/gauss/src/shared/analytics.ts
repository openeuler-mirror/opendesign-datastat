import { OpenAnalytics } from '@opensig/open-analytics';
import { OAUtil } from 'shared/analytics';
import { reportAnalytics } from 'shared/api/api-analytics';

class GaussOa extends OAUtil {
  oa?: OpenAnalytics;

  getInstance(): OpenAnalytics {
    if (!this.oa) {
      this.oa = new OpenAnalytics({
        appKey: 'openGauss',
        request: (data) => {
          reportAnalytics('opengauss', data);
        },
      });
      this.oa.setHeader({ service: 'datastat' });
    }
    return this.oa;
  }
}

const oa = new GaussOa();
export default oa;
