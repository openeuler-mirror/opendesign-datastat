import { defineStore } from 'pinia';
import { openCommunityInfo } from '@/api/index';
import { sortExp } from 'shared/utils/helper';
import { queryCompanyContribute } from 'shared/api/index';
import { IObject } from 'shared/@types/interface';
import { ceil } from 'lodash-es';

interface layoutStateTypes {
  rawData: IObject;
  companyData: IObject;
  ranking: number;
  totalLength: number;
  total: number;
  companyMaxNum: number;
  companyForm: IObject;
}

export const useCompanyStore = defineStore('company', {
  state: (): layoutStateTypes => ({
    rawData: [],
    companyData: [],
    // 显示排行数
    ranking: 10,
    // 总长度
    totalLength: 0,
    // 总和 计算百分比 只有gauss需要
    total: 0,
    // 获取最大值
    companyMaxNum: 0,
    // 筛选参数
    companyForm: {
      contributeType: 'PR',
      timeRange: 'lastonemonth',
      displayRange: '10',
    },
  }),
  actions: {
    async getCompanyData() {
      const params = {
        community: openCommunityInfo.name,
        contributeType: this.companyForm.contributeType,
        timeRange: this.companyForm.timeRange,
      };
      try {
        const res = await queryCompanyContribute(params);
        if (res.code === 200) {
          const { data } = res;
          const userList = data.sort(sortExp('contribute', false));
          this.companyMaxNum = ceil(userList[0].contribute, -2);
          this.rawData = data;

          // 筛选
          const newData = data.filter((i: IObject) => i.contribute > 0);
          const initVal = 0;
          this.total = newData.reduce((acc: number, cur: IObject) => {
            return acc + cur.contribute;
          }, initVal);
          this.totalLength = newData.length;
          this.companyData = newData.slice(0, this.ranking);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {
    rankingFilter: (state) => {
      return state.ranking > 2
        ? state.companyData.slice(0, state.ranking)
        : state.companyData;
    },
  },
});
