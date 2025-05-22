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
    num = '-';
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

/**
 * 将颜色值转换为有透明度的颜色值 rgb格式
 * @param value 为带'#'的纯色格式或rgb格式
 * @param opcity 透明度
 * @returns rgb格式
 */
export const getColorOpcity = (value: string, opcity = 1) => {
  const _value = getRGBColor(value);
  if (_value.startsWith('rgb') || _value.startsWith('RGB')) {
    const arr = _value.split(/\(|\)|,/);
    return `rgba(${arr[1]},${arr[2]},${arr[3]}, ${opcity})`;
  }
  return '';
};

/**
 * 将颜色值转换为有透明度的颜色值 rgb格式
 * @param value 为带'#'的格式
 * @returns rgb格式
 */
export const getRGBColor = (value: string) => {
  if (value.startsWith('#') && [4, 7].includes(value.length)) {
    let _value = value.slice(1);
    if (_value.length === 3) {
      _value = _value
        .split('')
        .map((item) => `${item}${item}`)
        .join('');
    }
    const r = parseInt(_value.slice(0, 2), 16);
    const g = parseInt(_value.slice(2, 4), 16);
    const b = parseInt(_value.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b})`;
  }
  return value;
};

/**
 * 格式化SIG返回数据
 */
//
export const sigsProcessing = (data: IObject) => {
  const firstKeys = Object.keys(data);
  const company = firstKeys.find((itme) => itme !== 'metrics');
  const sigData = data[company as string];
  const sigs = sigData.map((item: IObject) => {
    return item.sig;
  });

  return { company, sigs };
};

/**
 * 格式化Treemap数据
 */
//
export const treeProcessing = (data: IObject) => {
  const firstKeys = Object.keys(data);
  const company = firstKeys.find((itme) => itme !== 'metrics');
  const sigData = data[company as string];
  const sigs = sigData.map((item: IObject) => {
    const obj = { sig: item.sig, group: item.feature };
    data['metrics'].reduce((pre: IObject, next: string, index: number) => {
      pre[next] = item.value[index];
      return pre;
    }, obj);
    return obj;
  });
  return { company, sigs };
};
/**
 * 格式化users数据
 */
//
export const processing = (data: IObject) => {
  const firstKeys = Object.keys(data);
  const company = firstKeys.find((itme) => itme !== 'metrics');
  const sigData = data[company as string];
  return { company, sigData };
};

/**
 * 判断是否是移动端
 */
export const testIsPhone = () => {
  return /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent);
};

/**
 * 判断是否是测试环境
 */
export const isTest = () => {
  if (window.location.href.includes('test')) {
    return true;
  } else {
    return false;
  }
};

/**
 * 获取指定时区偏移量的年份
 * @param offset - 时区偏移量（单位：小时）。例如，UTC+8 时区，传入 8。
 * @returns 指定时区偏移量对应的年份
 */
export function getYearByOffset(offset = 8) {
  // 获取当前时间的 UTC 时间
  const now = new Date();
  const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  // 设置偏移
  utcTime.setHours(utcTime.getHours() + offset);

  return utcTime.getFullYear();
}
