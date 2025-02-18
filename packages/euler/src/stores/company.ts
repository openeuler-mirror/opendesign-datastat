import { defineStore } from 'pinia';
import { ref } from 'vue';
import { openCommunityInfo } from '@/api/index';
import { sortExp } from 'shared/utils/helper';
import { IObject, companyTypes } from 'shared/@types/interface';
import { queryCompanyContribute } from 'shared/api/index';
import { ceil } from 'lodash-es';
interface layoutStateTypes {
  rawData: IObject;
  companyData: IObject;
  ranking: number | string;
  searchRanking: number;
  totalLength: number;
  total: number;
  companyMaxNum: number;
  companyForm: IObject;
  switchValue: boolean;
  defaultNum: any;
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
    switchValue: true,
    // 默认选中值
    defaultNum: '',
    companyForm: {
      contributeType: 'pr',
      timeRange: 'lastonemonth',
      displayRange: '10',
      version: '',
    },
  }),
  actions: {
    async getCompanyData() {
      const params = ref();
      if (this.switchValue) {
        params.value = {
          community: openCommunityInfo.name,
          contributeType: this.companyForm.contributeType,
          version: this.companyForm.version,
        };
      } else {
        params.value = {
          community: openCommunityInfo.name,
          contributeType: this.companyForm.contributeType,
          timeRange: this.companyForm.timeRange,
        };
      }
      try {
        const res = await queryCompanyContribute(params.value);
        if (res.code === 200) {
          const { data } = res;
          const userList = data.sort(sortExp('contribute', false));
          this.companyMaxNum = ceil(userList[0].contribute, -2);
          const rankNum = ref(1);
          // 替换个人贡献者为*
          data.forEach((item: companyTypes) => {
            if (
              item.company_cn !== '个人贡献者' ||
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
