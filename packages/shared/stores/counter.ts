import { IObject } from '../@types/interface';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCounter = defineStore('counter', () => {
  // 登录信息
  const guardAuthClient = ref({} as IObject);
  const isLoggingIn = ref(false);
  const loginIframeSrc = ref('');
  return { guardAuthClient, isLoggingIn, loginIframeSrc };
});
