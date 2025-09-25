import { defineStore } from 'pinia';
import { request } from 'shared/plugins/axios';

const useLoginStore = defineStore('login', {
  state: () => ({
    logining: false,
    logined: false,
    data: null as null | Record<string, any>,
  }),
  getters: {
    username(state) {
      return state.data?.username as string ?? '';
    },
    photo(state) {
      return state.data?.photo as string ?? '';
    },
    nickname(state) {
      return state.data?.nickname as string ?? '';
    },
  },
  actions: {
    tokenExists() {
      return Boolean(document.cookie.match(/\b_U_T_=[^;]+/)?.[0]);
    },
    getUserInfo(force?: boolean) {
      if (!this.tokenExists()) return;
      if (!force && this.logined) return;
      this.logining = true;
      request
        .get('/api-id/oneid/personal/center/user?community=openubmc')
        .then((res) => res.data)
        .then((res) => {
          if (res.code !== 200 || !res.data) return;
          this.data = res.data;
          this.logining = false;
          this.logined = true;
        })
        .catch(() => (this.logining = false));
    },
  },
});

export default useLoginStore;
