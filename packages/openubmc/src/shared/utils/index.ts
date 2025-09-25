/**
 * @param arr 数组
 * @param target 目标
 * @param compareFn 比较函数，返回负数则target大于当前值，返回正数则target小于当前值
 * @returns -1: 没找到，否则返回index
 */
export function binarySearch<D, T>(arr: D[], target: T, compareFn: (current: D, target: T) => number) {
  if (!arr.length) return -1;
  if (arr.length === 1) return compareFn(arr[0], target) === 0 ? 0 : -1;
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    const cmp = compareFn(arr[mid], target);
    if (cmp === 0) return mid;
    if (cmp < 0) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

/**
 * 获取指定时区偏移量的年份
 * @param {number} offset - 时区偏移量（单位：小时）。例如，UTC+8 时区，传入 8。
 * @returns {number} - 指定时区偏移量对应的年份
 */
export function getYearByOffset(offset = 8) {
  // 获取当前时间的 UTC 时间
  const now = new Date();
  const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  // 设置偏移
  utcTime.setHours(utcTime.getHours() + offset);

  return utcTime.getFullYear();
}