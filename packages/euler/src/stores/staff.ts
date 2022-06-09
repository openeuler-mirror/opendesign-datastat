import { defineStore } from 'pinia';
import { openCommunityInfo } from '@/api/index';
import {
  queryCompanyUserContribute,
  querySigUserContribute,
} from 'shared/api/index';
import { sortExp } from 'shared/utils/helper';
interface Form {
  contributeType: string;
  timeRange: string;
}
export const useStaffStore = defineStore('staff', {
  state: () => ({
    personalData: [],
    memberData: [],
    staffMaxNum: 0, // 数据最大参数
    memberMaxNum: 0,
    // 筛选参数
    staffForm: {
      contributeType: 'PR',
      timeRange: 'lastonemonth',
    } as Form,
    memberForm: {
      contributeType: 'PR',
      timeRange: 'lastonemonth',
    } as Form,
  }),
  actions: {
    async getStaffData(companyName: any) {
      const params = {
        community: openCommunityInfo.name,
        contributeType: this.staffForm.contributeType,
        timeRange: this.staffForm.timeRange,
        company: companyName,
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
    async getMemberData(sigName: any) {
      const params = {
        community: openCommunityInfo.name,
        contributeType: this.memberForm.contributeType,
        timeRange: this.memberForm.timeRange,
        sig: sigName,
      };
      try {
        const res = await querySigUserContribute(params);
        if (res.code === 200) {
          const { data } = res;
          const userList = data.sort(sortExp('contribute', false));
          this.memberData = userList;
          this.memberMaxNum = userList[0].contribute;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {
    tableData: (state) => {
      return state.personalData;
    },
    memberData: (state) => {
      return state.memberData;
    },
  },
});
