import {
  getClientInfo,
  OpenAnalytics,
  OpenEventKeys,
} from '@opensig/open-analytics';
import { reportAnalytics } from '../api/api-analytics';
import { COOKIE_AGREED_STATUS, useCookieStore } from '../stores/cookies';
import { Router } from 'vue-router';

export class OAUtil {
  service = 'datastat';
  appKey: string;
  routerGuards?: (() => void)[];
  oa: OpenAnalytics;
  reportPerfCount = 0;

  constructor(appKey: string, reportUrlSuffix: string) {
    this.appKey = appKey;
    this.oa = new OpenAnalytics({
      appKey: this.appKey,
      request: (data) => {
        if (
          useCookieStore().getUserCookieStatus() !==
          COOKIE_AGREED_STATUS.ALL_AGREED
        ) {
          this.disable();
          return;
        }
        reportAnalytics(reportUrlSuffix, data);
      },
    });
  }

  enable(router: Router) {
    // baidu
    const hm = document.createElement('script');
    hm.src = 'https://hm.baidu.com/hm.js?0f2023d05716710fab4f4d4352f4c9ce';
    hm.classList.add('analytics-script');
    document.head.append(hm);

    this.oa.setHeader(getClientInfo());
    this.oa.enableReporting(true);
    this.setupRouterGuards(router);
    if (this.reportPerfCount >= 1) {
      return;
    }
    this.reportPerfCount++;
    this.reportPerformance();
  }

  async setupRouterGuards(router: Router) {
    await router.isReady();
    this.reportPV();
    (this.routerGuards ??= []).push(
      router.beforeEach((to, from) => {
        if (from.path === '/' || to.path === from.path) {
          return;
        }
        to.meta.$referrer = window.location.href;
      }),
      router.afterEach((to, from) => {
        if (to.path === from.path) {
          return;
        }
        this.reportPV(to.meta.$referrer as string);
      })
    );
  }

  disable() {
    const scripts = document.querySelectorAll('script.analytics-script');
    scripts.forEach((script) => {
      script.remove();
    });
    this.oa.enableReporting(false);
    if (this.routerGuards) {
      this.routerGuards.forEach((item) => item());
      this.routerGuards = [];
    }
    [
      `oa-${this.appKey}-client`,
      `oa-${this.appKey}-events`,
      `oa-${this.appKey}-session`,
    ].forEach((key) => {
      localStorage.removeItem(key);
    });
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
    if (!this.oa.enabled) {
      return;
    }
    return this.oa.report(
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
