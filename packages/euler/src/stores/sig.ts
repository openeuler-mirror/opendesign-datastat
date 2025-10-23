import { defineStore } from 'pinia';
import { querySigName } from 'shared/api/api-new';

const useSigStore = defineStore('sigs', {
  state() {
    return {
      allSigs: [] as string[],
    };
  },
  actions: {
    async getAllSigs() {
      try {
        const res = await querySigName('openeuler');
        if (Array.isArray(res.data)) {
          this.allSigs = res.data.sort((a: string, b: string) => a.localeCompare(b));
          return;
        }
      } catch (error) {
        this.allSigs = [];
      }
    },
  },
});

export default useSigStore;
