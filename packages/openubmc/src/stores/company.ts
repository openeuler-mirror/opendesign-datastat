import { defineStore } from 'pinia';
import { ceil } from 'lodash-es';
import { request } from 'shared/plugins/axios';
import { openCommunityInfo } from '@/shared/common';
import i18n from '@/i18n';

interface Company {
  company_zh: string;
  company_en: string;
  contribute: number;
}

export const useCompanyStore = defineStore('company', {
  state: () => ({
    rawData: [] as Company[],
    companyData: [] as Company[],
    // 显示排行数
    displayCount: 10,
    searchVal: '',
    // 获取最大值
    companyMaxNum: 0,
    defaultNum: '',
    companyForm: {
      contributeType: 'pr',
      timeRange: [] as Date[] | [Date, Date],
    },
  }),
  getters: {
    companyData(state) {
      let res = state.rawData ?? [];
      if (state.searchVal) {
        const upperCaseSearchVal = state.searchVal.toUpperCase();
        const lang = i18n.global.locale ?? 'zh';
        res = res.filter((i) => i[lang.value === 'zh' ? 'company_zh' : 'company_en'].toUpperCase().includes(upperCaseSearchVal));
      }
      if (state.displayCount) {
        return res.slice(0, state.displayCount);
      }
      return res;
    },
  },
  actions: {
    async getCompanyData() {
      const params = {
        community: openCommunityInfo.name,
        contributeType: this.companyForm.contributeType,
      } as Record<string, string | number>;
      if (this.companyForm.timeRange?.length === 2) {
        params.start = this.companyForm.timeRange[0].getTime();
        params.end = this.companyForm.timeRange[1].getTime();
      }
      try {
        const res = await request.get('/api-magic/stat_new/company/contribute', { params }).then((res) => res.data);
        if (res.code !== 1 || !res.data?.length) {
          this.companyMaxNum = 0;
          this.rawData = [];
          return;
        }
        const { data } = res;
        this.companyMaxNum = ceil(data[0]?.contribute ?? 0, -2);
        this.rawData = data;
      } catch (error) {
        this.companyMaxNum = 0;
        this.rawData = [];
        console.log(error);
      }
    },
  },
});
