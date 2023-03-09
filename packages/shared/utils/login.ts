import { IObject } from '../@types/interface';
import { queryCourse, queryToken, queryPermissions } from '../api/index';
import { useCounter } from '../stores/counter';
import { storeToRefs } from 'pinia';
import { testIsPhone } from './helper';
import { AuthenticationClient } from 'authing-js-sdk';
const LOGIN_KEYS = {
  USER_TOKEN: '_U_T_',
};

function setCookie(cname: string, cvalue: string, isDelete?: boolean) {
  const deleteStr = isDelete ? 'max-age=0; ' : '';
  const domain = import.meta.env.VITE_COOKIE_DOMAIN;
  const expires = `${deleteStr}path=/; domain=${domain}`;
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
const redirectUri = `${location.origin}/`;

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

export function getCodeByUrl(community: string) {
  const query = getUrlParam();
  if (query.code && query.state) {
    const param = {
      code: query.code,
      permission: 'sigRead',
      community,
      redirect: redirectUri,
    };
    queryToken(param)
      .then((res) => {
        const { data = {} } = res;
        const { token = '', photo = '' } = data;
        saveUserAuth(token);
        deleteUrlCode(query);
        const newUrl = `${location.origin}`;
        window.parent.window.location.href = newUrl;
      })
      .catch(() => {
        const newUrl = `${location.origin}`;
        window.parent.window.location.href = newUrl;
      });
  }
}
// 删除url上的code
function deleteUrlCode(query: IObject) {
  const arr = Object.entries(query);
  let url = location.origin + location.pathname;
  if (arr.length > 2) {
    const _arr = arr.filter((item) => !['code', 'state'].includes(item[0]));
    const search = _arr.reduce((pre, next) => {
      pre += `${next[0]}=${next[1]}`;
      return pre;
    }, '?');
    url += search;
  }
  history.replaceState(null, '', url);
}

function getUrlParam(url = window.location.search) {
  const param = {} as IObject;
  const arr = url.split('?');
  if (arr[1]) {
    const _arr = arr[1].split('&') || [];
    _arr.forEach((item) => {
      const it = item.split('=');
      if (it.length === 2) {
        const obj = {
          [it[0]]: it[1],
        };
        Object.assign(param, obj);
      }
    });
  }
  return param;
}

function createClient(community: string) {
  const obj: IObject = {
    openeuler: {
      // appId: '62845f26b7dbf20f7890c0ad',
      appId: '62679eab0b22b146d2ea0a3a',
      appHost: 'https://datastat.authing.cn',
      redirectUri,
    },
  };
  if (obj[community]) {
    return new AuthenticationClient(obj[community]);
  }
  return new AuthenticationClient(obj.openeuler);
}
// scope配置，设置登录后用户返回信息
const scopeConfig = {
  scope: 'openid profile username',
};
export function showGuard(community: string) {
  // const client = createClient(community);
  // // 构造 OIDC 授权登录 URL
  // const url = client.buildAuthorizeUrl(scopeConfig);
  // // 如果需要获取 Refresh token，请在 scope 中加入 offline_access 项
  // const url2 = client.buildAuthorizeUrl({
  //   scope: 'openid profile offline_access',
  // });
  // const { loginIframeSrc } = useStoreData();
  // loginIframeSrc.value = url;
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
      if (Object.prototype.toString.call(data) === '[object Object]') {
        guardAuthClient.value = data;
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
