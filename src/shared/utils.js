/**
 * 是否是函数
 * @param {*} obj
 * @returns Boolean
 */
export function isFunction(obj) {
  return typeof obj === 'function' && typeof obj.nodeType !== 'number';
}
//格式化数字 K
export function formatNumber(num) {
  return num >= 1e3 ? (num / 1e3).toFixed(1) + 'k' : num;
}
