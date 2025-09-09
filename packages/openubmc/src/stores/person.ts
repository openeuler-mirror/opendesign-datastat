import { openCommunityInfo } from '@/shared/common';
import { defineStore } from 'pinia';
import { request } from 'shared/plugins/axios';

export const usePersonalStore = defineStore('personal', {
  state: () => {
    return {
    personalData: [],
    personalMaxNum: 0, // 个人数据最大参数
    // 筛选参数
    personalForm: {
      contributeType: 'pr',
      timeRange: [new Date(2024, 10, 1), new Date()] as Date[] | [Date, Date],
    },
    allUsers: [] as string[],
    commentType: '',
  }
  },
  actions: {
    async getPersonalData() {
      const params = {
        community: openCommunityInfo.name,
        contributeType: this.personalForm.contributeType,
        comment_type: this.commentType
      } as Record<string, any>;
      if (this.personalForm.timeRange?.length === 2) {
        params.start = this.personalForm.timeRange[0].getTime();
        params.end = this.personalForm.timeRange[1].getTime();
      }
      try {
        const res = await request.get('/api-magic/stat_new/user/contribute', { params }).then((res) => res.data);
        if (res.code !== 1 || !res.data?.length) {
          this.personalData = [];
          this.personalMaxNum = 0;
          return;
        }
        const { data } = res;
        const userList = data;
        this.personalData = userList.slice(0, 20);
        this.personalMaxNum = userList[0].contribute;
      } catch (error) {
        this.personalData = [];
        this.personalMaxNum = 0;
        console.log(error);
      }
    },
  },
  getters: {
    // top10
    highRanking: (state) => {
      return state.personalData.slice(0, 10);
    },
    // top10-20
    lowRanking: (state) => {
      return state.personalData.slice(10, 20);
    },
  },
});
