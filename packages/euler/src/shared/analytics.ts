import { OpenAnalytics } from '@opensig/open-analytics';
import { OAUtil } from 'shared/analytics';
import { reportAnalytics } from 'shared/api/api-analytics';

class EulerOa extends OAUtil {
  oa?: OpenAnalytics;

  getInstance(): OpenAnalytics {
    if (!this.oa) {
      this.oa = new OpenAnalytics({
        appKey: 'openEuler',
        request: (data) => {
          reportAnalytics('openeuler', data);
        },
      });
    }
    return this.oa;
  }
}

const oa = new EulerOa();
export default oa;
