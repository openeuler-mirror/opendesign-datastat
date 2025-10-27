import { defineStore } from 'pinia';
import { IObject } from 'shared/@types/interface';
import { getNowFormatDate } from 'shared/utils/helper';
import { request } from 'shared/plugins/axios';

interface stateTypes {
  language: string;
  ISPC: boolean;
  swiperIndex: number;
  lang: string;
  time: string;
  moNav: number;
  allData: IObject;
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
    allData: {},
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
      request.get('/api-magic/stat/overview/count?community=mindspore').then((res) => {
        if (res.data?.data) {
          Object.assign(this.allData, res.data.data);
        }
      });
    },
  },
});
