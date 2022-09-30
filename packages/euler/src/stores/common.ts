import { defineStore } from 'pinia';
import { IObject } from 'shared/@types/interface';
import { queryAll } from 'shared/api/index';
import { getNowFormatDate } from 'shared/utils/helper';

interface stateTypes {
  language: string;
  ISPC: boolean;
  isBlackHeader: boolean;
  moNav: number;
  companyNav: number;
  sigNav: number;
  lang: string;
  time: string;
  allData: IObject;
  personNav: number;
}
export const useCommonStore = defineStore('common', {
  state: (): stateTypes => ({
    language: localStorage.getItem('lang') || 'zh',
    // 判断是否是PC
    ISPC: false,
    // 判断移动端header主题颜色
    isBlackHeader: true,
    moNav: 0,
    companyNav: 0,
    sigNav: 0,
    personNav:0,
    // 语言
    lang: '',
    // 时间
    time: '--',
    allData: [],
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
        const res = await queryAll('openeuler');
        if (res.code === 200) {
          this.allData = res.data;
          // if (res.update_at) {
          //   [this.time] = res.update_at.split('T');
          // }
          this.time = getNowFormatDate();
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
