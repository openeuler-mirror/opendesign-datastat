import { defineStore } from 'pinia';
import { openCommunityInfo } from '@/api/index';
import { queryUserContribute } from 'shared/api/api-new';
import { IObject } from 'shared/@types/interface';

export const usePersonalStore = defineStore('personal', {
  state: () => ({
    personalData: [],
    personalMaxNum: 0, // 个人数据最大参数
    // 筛选参数
    personalForm: {
      contributeType: 'pr',
      timeRange: 'lastonemonth',
      repo: 'coreRepo',
    } as IObject,
  }),
  actions: {
    async getPersonalData() {
      const params = {
        community: openCommunityInfo.name,
        contributeType: this.personalForm.contributeType,
        timeRange: this.personalForm.timeRange,
        repo: this.personalForm.repo,
      };
      if (this.personalForm.repo === '') {
        delete params.repo
      }
      if (params.repo?.startsWith('opengauss/')) {
        params.repo = params.repo.slice(10);
      }
      try {
        const res = await queryUserContribute(params);
        if (res.code === 1) {
          const { data } = res;
          this.personalData = data.slice(0, 20);
          this.personalMaxNum = data[0]?.contribute;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {
    // top10
    hightRanking: (state) => {
      return state.personalData.slice(0, 10);
    },
    // top10-20
    lowRanking: (state) => {
      return state.personalData.slice(10, 20);
    },
  },
});
