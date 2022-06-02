import { defineStore } from 'pinia';
import { openCommunityInfo } from '@/api/index';
import { queryCompanySigDetails } from 'shared/api/index';
import { sortExp } from 'shared/utils/helper';
interface Form {
  contributeType: string;
  timeRange: string;
}
export const useEcologicalStore = defineStore('ecological', {
  state: () => ({
    personalData: [],

    // 筛选参数
    ecologicalForm: {
      contributeType: 'PR',
      timeRange: 'lastonemonth',
    } as Form,
  }),
  actions: {
    async getEcologicalData() {
      const params = {
        community: openCommunityInfo.name,
        contributeType: this.ecologicalForm.contributeType,
        timeRange: this.ecologicalForm.timeRange,
        company: '华为技术有限公司',
      };
      try {
        const res = await queryCompanySigDetails(params);
        if (res.code === 200) {
          const { data } = res;
          const userList = data.sort(sortExp('contribute', false));
          this.personalData = userList;
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
