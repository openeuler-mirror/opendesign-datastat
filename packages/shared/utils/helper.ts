import { IObject } from '../@types/interface';

const cacheStringFn = <T extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null);
  return ((str: string) => {
    let rlt = cache[str];
    if (!rlt) {
      cache[str] = rlt;
      rlt = fn(str);
    }
    return rlt;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
};

const camelizeRegExp = /-(\w)/;
/**
 * kebab-case to camelCase
 */
export const camelize = cacheStringFn((str: string): string => {
  return str.replace(camelizeRegExp, (_, c) => (c ? c.toUpperCase() : ''));
});

/**
 * kebab-case to PascalCase
 */
export const pascalize = cacheStringFn((str: string): string => {
  const k = camelize(str);
  return k.charAt(0).toUpperCase() + k.slice(1);
});

const kebablizeRegExp = /\B([A-Z])/;
/**
 * to kebab-case
 */
export const kebablize = cacheStringFn((str: string): string => {
  return str.replace(kebablizeRegExp, '-$1').toLowerCase();
});

// 格式化数字 K
export function formatNumber(key: number) {
  let num: number | string = 0;
  if (key === undefined) {
    num = 0;
  } else {
    num = key >= 1e3 ? `${parseInt(`${(key / 1e3) * 10}`) / 10}K` : key;
  }

  return num;
}

// 格式化数字1000=>1,000
export function toThousands(key: number | 0) {
  let num: number | string = 0;
  if (key === undefined) {
    num = 0;
  } else {
    num = Number(key).toLocaleString('en-US');
  }
  return num;
}

// 数字排序 arr.sort(sortExp('code', false))
export function sortExp(key: string, isAsc: boolean) {
  return function (x: IObject, y: IObject) {
    return (x[key] - y[key]) * (isAsc ? 1 : -1);
  };
}

// 百分比计算
export const percentageTotal = (num: number, total: number) => {
  return `${((num / total) * 100).toFixed(1)}%`;
};

// 获取当前日期 yy-mm-dd
export const getNowFormatDate = () => {
  const date = new Date();
  const seperator1 = '-';

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const yearStr = `${year}`;
  let monthStr = `${month}`;
  let dayStr = `${day}`;

  if (month >= 1 && month <= 9) {
    monthStr = `0${month}`;
  }
  if (day >= 0 && day <= 9) {
    dayStr = `0${day}`;
  }
  const currentdate = yearStr + seperator1 + monthStr + seperator1 + dayStr;
  return currentdate;
};
