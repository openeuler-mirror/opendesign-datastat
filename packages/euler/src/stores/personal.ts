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
      contributeType: 'pr',
      timeRange: 'lastonemonth',
    } as Form,
    checkedComment: [] as any,
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
          if (this.personalForm.contributeType === 'comment') {
            const { data } = res;
            if (
              JSON.stringify(this.checkedComment) ===
              JSON.stringify(['General'])
            ) {
              const GeneralList = data.sort(sortExp('valid_comment', false));
              this.personalData = GeneralList.slice(0, 20);
              this.personalMaxNum = GeneralList[0].valid_comment;
            } else if (
              JSON.stringify(this.checkedComment) === JSON.stringify(['Order'])
            ) {
              const OrderList = data.sort(sortExp('invalid_comment', false));
              this.personalData = OrderList.slice(0, 20);
              this.personalMaxNum = OrderList[0].invalid_comment;
            } else {
              const List = data.sort(sortExp('contribute', false));
              this.personalData = List.slice(0, 20);
              this.personalMaxNum = List[0].contribute;
            }
          } else {
            const { data } = res;
            const userList = data.sort(sortExp('contribute', false));
            this.personalData = userList.slice(0, 20);
            this.personalMaxNum = userList[0].contribute;
          }
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