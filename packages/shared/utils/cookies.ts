import Cookies from 'js-cookie';

/**
 * 获取指定key的cookie值
 * @param key
 * @returns 值
 */
export function getCookie(key: string) {
  return Cookies.get(key);
}

/**
 * 设置cookie
 * @param key cookie的key
 * @param value cookie的值
 * @param day cookie的过期时间 默认1天
 */
export function setCookie(
  key: string,
  value: string,
  day = 1,
  domain: string = location.hostname
) {
  Cookies.set(key, value, { expires: day, domain });
}

/**
 * 删除cookie
 * @param key cookie的key
 */
export function removeCookie(key: string, opt?: object) {
  Cookies.remove(key, opt || {});
}
