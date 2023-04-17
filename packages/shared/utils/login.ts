import { queryCourse, queryPermissions } from '../api/index';
import { useCounter } from '../stores/counter';
import { storeToRefs } from 'pinia';
import { testIsPhone } from './helper';
const LOGIN_KEYS = {
  USER_TOKEN: '_U_T_',
  USER_INFO: '_U_I_',
};

function setCookie(cname: string, cvalue: string, isDelete?: boolean) {
  const deleteStr = isDelete ? 'max-age=0; ' : '';
  const domain = import.meta.env.VITE_COOKIE_DOMAIN;
  const expires = `${deleteStr}path=/; domain=${domain}`;
  document.cookie = `${cname}=${cvalue}; ${expires}`;
}
const setSessionInfo = (data: any) => {
  const { username, photo } = data || {};
  if (username && photo) {
    sessionStorage.setItem(
      LOGIN_KEYS.USER_INFO,
      JSON.stringify({ username, photo })
    );
  }
};
const getSessionInfo = () => {
  let username = '';
  let photo = '';
  try {
    const info = sessionStorage.getItem(LOGIN_KEYS.USER_INFO);
    if (info) {
      const obj = JSON.parse(info) || {};
      username = obj.username || '';
      photo = obj.photo || '';
    }
  } catch (error) {}
  return {
    username,
    photo,
  };
};
const removeSessionInfo = () => {
  sessionStorage.removeItem(LOGIN_KEYS.USER_INFO);
};
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
  setCookie(cname, 'null', true);
}

// 存储用户id及token，用于下次登录
export function saveUserAuth(code = '') {
  if (!code) {
    deleteCookie(LOGIN_KEYS.USER_TOKEN);
  } else {
    setCookie(LOGIN_KEYS.USER_TOKEN, code);
  }
}

// 获取用户id及token
export function getUserAuth() {
  const token = getCookie(LOGIN_KEYS.USER_TOKEN) || '';
  if (!token) {
    saveUserAuth();
  }
  return {
    token,
  };
}

// 退出登录
export function logout(community: string) {
  location.href = `${import.meta.env.VITE_LOGIN_ORIGIN}/logout?redirect_uri=${
    window?.location?.origin
  }`;
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
export function showGuard(community: string) {
  const origin = import.meta.env.VITE_LOGIN_ORIGIN;
  const lang = window.localStorage.getItem('lang');
  location.href = `${origin}/login?redirect_uri=${location.href}&lang=${lang}`;
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
  refreshInfo(community);
}

// 刷新后重新请求登录用户信息
export function refreshInfo(community: string) {
  const { token } = getUserAuth();
  if (token) {
    queryCourse({ community }).then((res) => {
      const { data } = res;
      const { guardAuthClient } = useStoreData();
      guardAuthClient.value = getSessionInfo();
      if (Object.prototype.toString.call(data) === '[object Object]') {
        guardAuthClient.value = data;
        setSessionInfo(data);
      }
    });
    queryPermissions({ community }).then((res) => {
      const { data } = res;
      const { guardData } = useStoreData();
      if (
        !guardData.value.username &&
        Object.prototype.toString.call(data) === '[object Object]'
      ) {
        guardData.value = data;
      }
    });
  } else {
    removeSessionInfo();
  }
}

// export function hasPermission(per: string) {
//   const { guardAuthClient } = useStoreData();
//   if (Array.isArray(guardAuthClient?.value?.permissions)) {
//     return guardAuthClient.value.permissions.includes(per);
//   }
//   return false;
// }
export function hasPermission(per: string) {
  const { guardData } = useStoreData();
  if (Array.isArray(guardData?.value?.permissions)) {
    return guardData.value.permissions.includes(per);
  }
  return false;
}
export function hasPermissions(per: string) {
  const { guardData } = useStoreData();
  if (Array.isArray(guardData?.value?.companyList)) {
    return guardData.value.companyList.includes(per);
  }
  return false;
}
