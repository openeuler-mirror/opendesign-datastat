import { defineStore } from 'pinia';
import { ref } from 'vue';
import { openCommunityInfo } from '@/api/index';
import { queryCompanyContribute } from 'shared/api/api-new';
import { IObject, companyTypes } from 'shared/@types/interface';
import { ceil } from 'lodash-es';

interface layoutStateTypes {
  rawData: IObject;
  companyData: IObject;
  ranking: number | string;
  totalLength: number;
  searchRanking: number;
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
    searchRanking: 0,
    // 总和 计算百分比 只有gauss需要
    total: 0,
    // 获取最大值
    companyMaxNum: 0,
    // 筛选参数
    companyForm: {
      contributeType: 'pr',
      timeRange: 'all',
      displayRange: '10',
      repo: 'coreRepo',
    },
  }),
  actions: {
    async getCompanyData() {
      const params = {
        community: openCommunityInfo.name,
        contributeType: this.companyForm.contributeType,
        timeRange: this.companyForm.timeRange,
        repo: this.companyForm.repo,
      };
      if (this.companyForm.repo === '') {
        delete params.repo
      }
      if (params.repo?.startsWith('opengauss/')) {
        params.repo = params.repo.slice(10);
      }
      try {
        const res = await queryCompanyContribute(params);
        if (res.code === 1) {
          const { data } = res;
          // const userList = data.sort(sortExp('contribute', false));
          this.companyMaxNum = ceil(data[0].contribute, -2);
          const rankNum = ref(1);
          // 替换个人贡献者为*
          data.forEach((item: companyTypes) => {
            if (
              item.company_zh !== '个人贡献者' ||
              item.company_en !== 'independent'
            ) {
              item.index = rankNum.value++;
            } else {
              item.index = '*';
            }
          });
          this.rawData = data;

          // 筛选
          const newData = data.filter((i: IObject) => i.contribute > 0);
          const initVal = 0;
          this.total = newData.reduce((acc: number, cur: IObject) => {
            return acc + cur.contribute;
          }, initVal);
          this.totalLength = newData.length;

          this.ranking =
            this.companyForm.displayRange === 'all'
              ? this.totalLength
              : this.companyForm.displayRange;

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
