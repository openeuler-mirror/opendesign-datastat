import { defineStore } from 'pinia';
import { getOverviewContributeData, queryCoreRepos, getOveriewAllUsersCount } from 'shared/api/api-new';
import { IObject } from 'shared/@types/interface';
import { getNowFormatDate } from 'shared/utils/helper';
import { request } from 'shared/plugins/axios';

interface stateTypes {
  language: string;
  ISPC: boolean;
  swiperIndex: number;
  moNav: number;
  lang: string;
  time: string;
  allData: IObject;
  selectScroll: boolean;
  reposData: IObject;
  companyNav: number;
  sigNav: number;
  isBlackHeader: boolean;
  personNav: number;
}
export const useCommonStore = defineStore('common', {
  state: (): stateTypes => ({
    language: localStorage.getItem('lang') || 'zh',
    // 判断是否是PC
    ISPC: false,
    // 移动端滑动页数
    swiperIndex: 0,
    moNav: 0,
    // 语言
    lang: '',
    // 时间
    time: '--',
    allData: {} as Record<string, number | string>,
    selectScroll: true,
    // 仓库列表
    reposData: [],
    isBlackHeader: true,
    companyNav: 0,
    sigNav: 0,
    personNav: 0,
  }),
  actions: {
    setLanguage(language: string) {
      this.language = language;
    },
    setDevice(device: boolean) {
      this.ISPC = device;
    },
    async getAllData() {
      this.time = getNowFormatDate();
      request.get('/api-magic/stat_new/overview/count?community=opengauss').then((res) => {
        if (res.data?.data) {
          Object.assign(this.allData, res.data.data);
        }
      });
      // 社区用户
      getOveriewAllUsersCount('opengauss').then((res) => {
        if (res.data) {
          this.allData.users = res.data.total_count;
        }
      });
    },
    getContributeData() {
      getOverviewContributeData('opengauss').then((res) => {
        if (res.code === 1 && res.data) {
          // this.allData.
        }
      });
    },
    // 获取仓库列表
    async getReposData() {
      try {
        const res = await queryCoreRepos('opengauss');
        if (res.code === 1) {
          this.reposData = res.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
