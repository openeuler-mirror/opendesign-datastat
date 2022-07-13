import { Guard, GuardMode } from '@authing/native-js-ui-components';
import { IObject } from '../@types/interface';
import { queryCourse } from '../api/index';
import { useCounter } from '../stores/counter';
import { storeToRefs } from 'pinia';
import { testIsPhone } from './helper';
const LOGIN_KEYS = {
  USER_TOKEN: '_U_T_',
  USER_ID: '_U_I_',
};

function setCookie(cname: string, cvalue: string, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue}; ${expires}`;
}
function getCookie(cname: string) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}
function deleteCookie(cname: string) {
  setCookie(cname, 'null', -1);
}

// 存储用户id及token，用于下次登录
export function saveUserAuth(id = '', code = '') {
  if (!id && !code) {
    deleteCookie(LOGIN_KEYS.USER_TOKEN);
    deleteCookie(LOGIN_KEYS.USER_ID);
  } else {
    setCookie(LOGIN_KEYS.USER_TOKEN, code, 1);
    setCookie(LOGIN_KEYS.USER_ID, id, 1);
  }
}

// 获取用户id及token
export function getUserAuth() {
  const token = getCookie(LOGIN_KEYS.USER_TOKEN) || '';
  const userId = getCookie(LOGIN_KEYS.USER_ID) || '';
  if (!token || !userId) {
    saveUserAuth();
  }
  return {
    userId,
    token,
  };
}

// 退出登录
export function logout() {
  saveUserAuth();
  goToHome();
}

// 跳转首页
export function goToHome() {
  if (!testIsPhone()) {
    window.location.href = window.location.origin;
  } else {
    const lang = window.localStorage.getItem('lang');
    window.location.href = `/${lang}/mobile`;
  }
}

// 登录弹窗
let guard: any;
export function showGuard(community: string) {
  const { isLoggingIn } = useStoreData();
  isLoggingIn.value = !isLoggingIn.value;
  if (!guard) {
    initGuard(community);
  } else {
    guard.show();
  }
  guard.show();
}
export function initGuard(community: string) {
  if (!guard) {
    const appId = '62845f26b7dbf20f7890c0ad';
    guard = new Guard(appId, {
      mode: GuardMode.Modal,
      clickCloseable: true,
      escCloseable: true,
      disableRegister: true,
      disableResetPwd: true,
    });
    guard.on('login', (user: IObject) => {
      const params = {
        userId: user.id,
        permission: 'sigRead',
        community,
      };
      queryCourse(params).then((res) => {
        const { data } = res;
        const { guardAuthClient } = useStoreData();
        guardAuthClient.value = data;
        saveUserAuth(data.id, data.token);
        setTimeout(() => {
          guard.hide();
          removeGuard();
          window.location.reload();
        }, 300);
      });
    });
    guard.on('close', () => {
      const { isLoggingIn } = useStoreData();
      isLoggingIn.value = false;
      });
  }
  return guard;
}

export function removeGuard() {
  guard = null;
}

// token失效跳转首页
export function tokenFailIndicateLogin() {
  saveUserAuth();
  const { guardAuthClient } = useStoreData();
  guardAuthClient.value = {};
  goToHome();
}

/**
 * @callback store 将store返回，使用解构赋值接受
 */
export function useStoreData() {
  const counter = useCounter();
  const stores = storeToRefs(counter);
  return stores;
}

// 刷新页面后store内参数被清除，需重新设定
export function setStoreData(community: string) {
  const { guardAuthClient } = useStoreData();
  const { userId } = getUserAuth();
  if (!guardAuthClient.value.photo && userId) {
    const params = {
      userId,
      permission: 'sigRead',
      community,
    };
    queryCourse(params).then((res) => {
      const { data } = res;
      guardAuthClient.value = data;
      saveUserAuth(data.id, data.token);
    });
  }
}

export function hasPermission(per: string) {
  const { guardAuthClient } = useStoreData();
  if (Array.isArray(guardAuthClient?.value?.permissions)) {
    return guardAuthClient.value.permissions.includes(per);
  }
  return false;
}
