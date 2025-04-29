import { defineStore } from 'pinia';
import { queryAll } from 'shared/api/index';
import { getOverviewContributeData, getOverviewOrgMemberCount, getOverviewSigCount, getOverviewContributorCount, queryCoreRepos } from 'shared/api/api-new';
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
      try {
        const res = await queryAll('opengauss');
        if (res.code === 200) {
          const data = { ...res.data };
          ['prs', 'comments', 'issues', 'partners', 'contributors', 'sigs'].forEach((prop) => {
            delete data[prop];
          });
          this.allData = data;
          this.time = getNowFormatDate();
        }

        const [contributeRes, orgMemberRes, contributorRes, sigRes] = await Promise.all([
          getOverviewContributeData('opengauss'),
          getOverviewOrgMemberCount('opengauss'),
          getOverviewContributorCount('opengauss'),
          getOverviewSigCount('opengauss'),
        ]);
        // pr，issue，comment数量
        if (contributeRes && contributeRes.code === 1 && contributeRes.data) {
          this.allData.prs = contributeRes.data.pr;
          this.allData.comments = contributeRes.data.comment;
          this.allData.issues = contributeRes.data.issue;
        }
        // 单位会员个数
        if (orgMemberRes && orgMemberRes.code === 1 && orgMemberRes.data) {
          this.allData.partners = orgMemberRes.data.partner;
        }
        // 贡献者人数
        if (contributorRes && contributorRes.code === 1 && contributorRes.data) {
          this.allData.contributors = contributorRes.data.contributor;
        }
        // sig个数
        if (sigRes && sigRes.code === 1 && sigRes.data) {
          this.allData.sigs = sigRes.data.sig;
        }
      } catch (error) {
        console.log(error);
      }
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
