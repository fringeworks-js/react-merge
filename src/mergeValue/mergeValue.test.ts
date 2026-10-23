import { isPlainObject } from 'remeda';
import mergeValue from './mergeValue';

describe('mergeValue', () => {
  test('No items', () => {
    const result = mergeValue<any, any>([], (current, value) => {
      return current + value;
    });
    expect(result).toBeUndefined();
  });

  test('string', () => {
    const result = mergeValue<any, any>(
      ['a', 1, 'b', { A: true, B: true, C: true }, 'c'],
      (current, value) => {
        if (typeof value === 'string') {
          return current + value;
        }
        return undefined;
      },
      { initialValue: '' },
    );
    expect(result).toBe('abc');
  });

  test('object', () => {
    const result = mergeValue<any, any>(
      [{ a: 1 }, ['a'], { b: 2 }, null, { c: 3 }],
      (current, value) => {
        if (isPlainObject(value)) {
          return Object.assign(current, value);
        }
      },
      { initialValue: {} },
    );
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  test('array', () => {
    const result = mergeValue<any, any>(
      [[1, 2, 3], { a: 'a' }, [4, 5, 6], null, [7, 8, 9]],
      (current, value) => {
        if (Array.isArray(value)) {
          return current.concat(value);
        }
      },
      { initialValue: [] },
    );
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test('initialValue function', () => {
    const result = mergeValue<number, number[]>(
      [1, 2],
      (current, value) => [...current, value],
      { initialValue: () => [0] },
    );
    expect(result).toEqual([0, 1, 2]);
  });

  test('Does not traverse objects', () => {
    const result = mergeValue<any, any>(
      ['a', { b: 'b' }, ['c', ['d']]],
      (current, value) => {
        if (typeof value === 'string') {
          return current + value;
        }
        return undefined;
      },
      { initialValue: '' },
    );
    expect(result).toBe('acd');
  });
});
