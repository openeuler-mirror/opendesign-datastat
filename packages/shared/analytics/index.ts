import {
  getClientInfo,
  OpenAnalytics,
  OpenEventKeys,
} from '@opensig/open-analytics';
import { Router } from 'vue-router';

export abstract class OAUtil {
  service = 'datastat';
  abstract getInstance(): OpenAnalytics;

  async enable(router: Router) {
    const oa = this.getInstance();
    oa.setHeader(getClientInfo());
    oa.enableReporting(true);
    await router.isReady();
    this.reportPV();
    router.beforeEach((to, from) => {
      if (from.path === '/' || to.path === from.path) {
        return;
      }
      to.meta.$referrer = window.location.href;
    });
    router.afterEach((to, from) => {
      if (to.path === from.path) {
        return;
      }
      this.reportPV(to.meta.$referrer as string);
    });
  }

  disable() {
    this.getInstance().enableReporting(false);
  }

  reportPV($referrer?: string) {
    this.report(OpenEventKeys.PV, $referrer ? { $referrer } : undefined);
  }

  report<T>(
    event: string,
    eventData?: T | ((...opts: any[]) => Promise<T> | T),
    $service = this.service,
    options?: {
      immediate?: boolean;
      eventOptions?: any;
    }
  ) {
    return this.getInstance().report(
      event,
      async () => ({
        $service,
        ...(typeof eventData === 'function'
          ? await (eventData as (...opts: any[]) => Promise<T> | T)()
          : eventData),
      }),
      options
    );
  }

  reportPerformance() {
    this.report(OpenEventKeys.LCP);
    this.report(OpenEventKeys.INP);
    this.report(OpenEventKeys.PageBasePerformance);
  }
}
