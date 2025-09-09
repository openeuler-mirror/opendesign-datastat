import { defineStore } from 'pinia';
import { IObject } from 'shared/@types/interface';
import { getOveriewAllUsersCount, getOverviewAllData } from 'shared/api/api-new';
import { getNowFormatDate } from 'shared/utils/helper';

interface stateTypes {
  language: string;
  ISPC: boolean;
  isBlackHeader: boolean;
  moNav: number;
  companyNav: number;
  sigNav: number;
  time: string;
  allData: IObject;
  personNav: number;
}
export const useCommonStore = defineStore('common', {
  state: (): stateTypes => ({
    language: 'zh',
    // 判断是否是PC
    ISPC: false,
    // 判断移动端header主题颜色
    isBlackHeader: true,
    moNav: 0,
    companyNav: 0,
    sigNav: 0,
    personNav: 0,
    // 时间
    time: '--',
    allData: {},
  }),
  actions: {
    setLanguage(lang: string) {
      this.language = lang;
    },
    setDevice(device: boolean) {
      this.ISPC = device;
    },
    getAllData() {
      this.time = getNowFormatDate();
      getOverviewAllData('openubmc').then((res) => {
        if (res.data) {
          Object.assign(this.allData, res.data);
        }
      });
      // 社区用户
      getOveriewAllUsersCount('openubmc').then((res) => {
        if (res.data) {
          this.allData.users = res.data.total_count;
        }
      });
    },
  },
});
