import { defineStore } from 'pinia';
import { openCommunityInfo } from '@/api/index';
import { queryUserContribute } from 'shared/api/api-new';
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
      contributeType: 'pr',
      timeRange: 'lastonemonth',
    } as Form,
    checkedComment: [] as string[],
    allUsers: null as null | Map<string, number>,
  }),
  actions: {
    async getPersonalData() {
      const params = {
        community: openCommunityInfo.name,
        contributeType: this.personalForm.contributeType,
        timeRange: this.personalForm.timeRange,
      } as Record<string, any>;
      if (this.personalForm.contributeType === 'comment') {
        const [a, b] = this.checkedComment ?? [];
        if (a && !b) {
          if (a === 'General') {
            params.comment_type = 'normal';
          } else {
            params.comment_type = 'command';
          }
        }
      }
      try {
        const res = await queryUserContribute(params);
        if (res.code === 1) {
          const { data } = res;
          const userList = data;
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
