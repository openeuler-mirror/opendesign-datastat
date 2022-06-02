import { defineStore } from 'pinia';
import { openCommunityInfo } from '@/api/index';
import { queryCompanyUserContribute } from 'shared/api/index';
import { sortExp } from 'shared/utils/helper';
interface Form {
  contributeType: string;
  timeRange: string;
}
export const useStaffStore = defineStore('staff', {
  state: () => ({
    personalData: [],
    staffMaxNum: 0, // 个人数据最大参数`
    // 筛选参数
    staffForm: {
      contributeType: 'PR',
      timeRange: 'lastonemonth',
    } as Form,
  }),
  actions: {
    async getStaffData() {
      const params = {
        community: openCommunityInfo.name,
        contributeType: this.staffForm.contributeType,
        timeRange: this.staffForm.timeRange,
        company: '华为技术有限公司',
      };
      try {
        const res = await queryCompanyUserContribute(params);
        if (res.code === 200) {
          const { data } = res;
          const userList = data.sort(sortExp('contribute', false));
          this.personalData = userList;
          this.staffMaxNum = userList[0].contribute;
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
