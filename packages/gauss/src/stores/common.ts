import { defineStore } from 'pinia';
import { queryAll, queryRepos } from 'shared/api/index';
import { IObject } from 'shared/@types/interface';
import { getNowFormatDate } from 'shared/utils/helper';

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
    allData: [],
    selectScroll: true,
    // 仓库列表
    reposData: [],
    isBlackHeader: true,
    companyNav: 0,
    sigNav: 0,
    personNav:0,
  }),
  actions: {
    setLanguage(language: string) {
      this.language = language;
    },
    setDevice(device: boolean) {
      this.ISPC = device;
    },
    async getAllData() {
      try {
        const res = await queryAll('opengauss');
        if (res.code === 200) {
          this.allData = res.data;
          this.time = getNowFormatDate();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取仓库列表
    async getReposData() {
      try {
        const res = await queryRepos('opengauss');
        if (res.code === 200) {
          this.reposData = res.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
