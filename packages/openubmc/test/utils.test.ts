import { describe, it, expect } from 'vitest';
import { binarySearch, getYearByOffset } from '../src/shared/utils/index';

describe('binarySearch', () => {
  it('should return -1 for empty array', () => {
    const arr: number[] = [];
    const result = binarySearch(arr, 5, (a, b) => a - b);
    expect(result).toBe(-1);
  });

  it('should return 0 if single element matches', () => {
    const arr = [5];
    const result = binarySearch(arr, 5, (a, b) => a - b);
    expect(result).toBe(0);
  });

  it('should return -1 if single element does not match', () => {
    const arr = [5];
    const result = binarySearch(arr, 3, (a, b) => a - b);
    expect(result).toBe(-1);
  });

  it('should find target at the beginning', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = binarySearch(arr, 1, (a, b) => a - b);
    expect(result).toBe(0);
  });

  it('should find target in the middle', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = binarySearch(arr, 3, (a, b) => a - b);
    expect(result).toBe(2);
  });

  it('should find target at the end', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = binarySearch(arr, 5, (a, b) => a - b);
    expect(result).toBe(4);
  });

  it('should return -1 if target not found', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = binarySearch(arr, 6, (a, b) => a - b);
    expect(result).toBe(-1);
  });

  it('should work with custom compare function', () => {
    const arr = [{ value: 1 }, { value: 2 }, { value: 3 }];
    const result = binarySearch(arr, 2, (a, b) => a.value - b);
    expect(result).toBe(1);
  });
});

describe('getYearByOffset', () => {
  it('should return current year with default offset 8', () => {
    // Current date is 2026-03-05, with offset 8, should be 2026
    const result = getYearByOffset();
    expect(result).toBe(2026);
  });

  it('should return correct year with offset 0 (UTC)', () => {
    const result = getYearByOffset(0);
    expect(result).toBe(2026);
  });

  it('should return correct year with positive offset', () => {
    // Assuming current UTC is 2026-03-05, offset +8 should still be 2026
    const result = getYearByOffset(8);
    expect(result).toBe(2026);
  });

  it('should return correct year with negative offset', () => {
    // For negative offset, might cross year boundary, but in this case, still 2026
    const result = getYearByOffset(-8);
    expect(result).toBe(2026);
  });
});