import { defineStore } from 'pinia';
import { openCommunityInfo } from '@/api/index';
import { queryUserContribute } from 'shared/api/index';
import { sortExp } from 'shared/utils/helper';
interface Form {
  contributeType: string;
  timeRange: string;
}
export const usePersonalStore = defineStore('personal', {
  state: () => ({
    personalData: [],
    personalMaxNum: 0, // 个人数据最大参数
    // 筛选参数
    personalForm: {
      contributeType: 'PR',
      timeRange: 'lastonemonth',
    } as Form,
  }),
  actions: {
    async getPersonalData() {
      const params = {
        community: openCommunityInfo.name,
        contributeType: this.personalForm.contributeType,
        timeRange: this.personalForm.timeRange,
      };
      try {
        const res = await queryUserContribute(params);
        if (res.code === 200) {
          const { data } = res;
          const userList = data.sort(sortExp('contribute', false));
          this.personalData = userList.slice(0, 20);
          this.personalMaxNum = userList[0].contribute;
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
