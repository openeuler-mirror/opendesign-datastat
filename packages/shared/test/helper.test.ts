import { describe, it, expect, vi } from 'vitest';
import {
  formatNumber,
  toThousands,
  sortExp,
  percentageTotal,
  getNowFormatDate,
  getColorOpcity,
  getRGBColor,
  sigsProcessing,
  treeProcessing,
  processing,
  testIsPhone,
  isTest,
  getYearByOffset,
} from '../utils/helper';

describe('formatNumber', () => {
  it('should return "-" for undefined', () => {
    expect(formatNumber(undefined as any)).toBe('-');
  });

  it('should return "-" for null', () => {
    expect(formatNumber(null as any)).toBe('-');
  });

  it('should return number as is if less than 1000', () => {
    expect(formatNumber(500)).toBe(500);
  });

  it('should format to K if >= 1000', () => {
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(1000)).toBe('1K');
  });
});

describe('toThousands', () => {
  it('should return "-" for undefined', () => {
    expect(toThousands(undefined as any)).toBe('-');
  });

  it('should format number with commas', () => {
    expect(toThousands(1000)).toBe('1,000');
    expect(toThousands(1234567)).toBe('1,234,567');
  });
});

describe('sortExp', () => {
  it('should sort ascending', () => {
    const arr = [{ code: 3 }, { code: 1 }, { code: 2 }];
    arr.sort(sortExp('code', true));
    expect(arr).toEqual([{ code: 1 }, { code: 2 }, { code: 3 }]);
  });

  it('should sort descending', () => {
    const arr = [{ code: 1 }, { code: 3 }, { code: 2 }];
    arr.sort(sortExp('code', false));
    expect(arr).toEqual([{ code: 3 }, { code: 2 }, { code: 1 }]);
  });
});

describe('percentageTotal', () => {
  it('should calculate percentage', () => {
    expect(percentageTotal(50, 200)).toBe('25.0%');
    expect(percentageTotal(1, 3)).toBe('33.3%');
  });
});

describe('getNowFormatDate', () => {
  it('should return current date in yy-mm-dd format', () => {
    // Mock Date to 2026-03-05
    const mockDate = new Date(2026, 2, 5); // Month is 0-based
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
    expect(getNowFormatDate()).toBe('2026-03-05');
    vi.useRealTimers();
  });
});

describe('getColorOpcity', () => {
  it('should convert hex to rgba', () => {
    expect(getColorOpcity('#ff0000', 0.5)).toMatch(/rgba\(\s{0,}255\s{0,},\s{0,}0\s{0,},\s{0,}0\s{0,},\s{0,}0.5\)/);
    expect(getColorOpcity('#abc', 1)).toBe('rgba(170, 187, 204, 1)');
  });

  it('should return empty for invalid', () => {
    expect(getColorOpcity('invalid')).toBe('');
  });
});

describe('getRGBColor', () => {
  it('should convert hex to rgb', () => {
    expect(getRGBColor('#ff0000')).toBe('rgba(255, 0, 0)');
    expect(getRGBColor('#abc')).toBe('rgba(170, 187, 204)');
  });

  it('should return as is if not hex', () => {
    expect(getRGBColor('rgb(255,0,0)')).toBe('rgb(255,0,0)');
  });
});

describe('sigsProcessing', () => {
  it('should process sig data', () => {
    const data = {
      company: [{ sig: 'sig1' }, { sig: 'sig2' }],
      metrics: ['m1', 'm2'],
    };
    const result = sigsProcessing(data);
    expect(result).toEqual({ company: 'company', sigs: ['sig1', 'sig2'] });
  });
});

describe('treeProcessing', () => {
  it('should process tree data', () => {
    const data = {
      company: [{ sig: 'sig1', feature: 'feat1', value: [1, 2] }],
      metrics: ['m1', 'm2'],
    };
    const result = treeProcessing(data);
    expect(result.company).toBe('company');
    expect(result.sigs[0]).toEqual({ sig: 'sig1', group: 'feat1', m1: 1, m2: 2 });
  });
});

describe('processing', () => {
  it('should process data', () => {
    const data = {
      company: 'data',
      metrics: ['m1'],
    };
    const result = processing(data);
    expect(result).toEqual({ company: 'company', sigData: 'data' });
  });
});

describe('testIsPhone', () => {
  it('should return true for mobile user agent', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'iPhone',
      writable: true,
    });
    expect(testIsPhone()).toBe(true);
  });

  it('should return false for desktop', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      writable: true,
    });
    expect(testIsPhone()).toBe(false);
  });
});

describe('isTest', () => {
  it.skip('should return true if url includes test', () => {
    global.window = { location: { href: 'http://test.example.com' } } as any;
    expect(isTest()).toBe(true);
  });

  it.skip('should return false otherwise', () => {
    global.window = { location: { href: 'http://example.com' } } as any;
    expect(isTest()).toBe(false);
  });
});

describe('getYearByOffset', () => {
  it('should return year with offset', () => {
    // Mock current date
    const mockDate = new Date(2026, 2, 5);
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
    expect(getYearByOffset(8)).toBe(2026);
    vi.useRealTimers();
  });
});