import { defineStore } from 'pinia';
import { openCommunityInfo } from '@/api/index';
import { queryUserContribute } from 'shared/api/index';
import { sortExp } from 'shared/utils/helper';
import { IObject } from 'shared/@types/interface';

export const usePersonalStore = defineStore('personal', {
  state: () => ({
    personalData: [],
    personalMaxNum: 0, // 个人数据最大参数
    // 筛选参数
    personalForm: {
      contributeType: 'PR',
      timeRange: 'lastonemonth',
      repo: 'opengauss/openGauss-server',
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
      this.personalForm.repo === '' ? delete params.repo : params;
      try {
        const res = await queryUserContribute(params);
        if (res.code === 200) {
          const { data } = res;
          const userList = data.sort(sortExp('contribute', false));
          this.personalData = userList.slice(0, 20);
          this.personalMaxNum = userList[0]?.contribute;
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
