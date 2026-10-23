import mergeObject from './mergeObject';

describe('mergeObject', () => {
  test('No items', () => {
    const result = mergeObject<any, any>(
      [],
      [
        {
          strategy: (current: any, value: any) => {
            return Object.assign(current, value);
          },
        },
      ],
    );
    expect(result).toEqual({});
  });

  test('object', () => {
    const result = mergeObject<any, any>(
      [{ a: 1, b: 2, c: 3 }, ['a'], { b: 12 }, null, { a: 21, d: 24 }],
      [
        {
          strategy: (_current: any, value: any) => {
            return value;
          },
        },
      ],
    );
    expect(result).toEqual({ a: 21, b: 12, c: 3, d: 24 });
  });

  test('condition', () => {
    const result = mergeObject<any, any>(
      [
        { a: 1, b: 2, c: 3 },
        ['a'],
        { a: 11, b: 12, c: 13, d: 14 },
        null,
        { a: 21, b: 22, c: 23 },
      ],
      [
        {
          condition: 'a',
          strategy: (current: any, value: any) => {
            if (current == undefined || current < value) {
              return value;
            }
          },
        },
        {
          condition: /^b$/,
          strategy: (current: any, value: any) => {
            if (current == undefined || current > value) {
              return value;
            }
          },
        },
        {
          condition: (key: PropertyKey, _value: unknown) => key === 'c',
          strategy: (current: any, value: any) => {
            if (current == undefined) {
              return value;
            } else {
              return current + value;
            }
          },
        },
        { strategy: (_current: any, value: any) => value },
      ],
    );
    expect(result).toEqual({ a: 21, b: 2, c: 39, d: 14 });
  });

  test('excludeUnmatched', () => {
    const result = mergeObject<any, any>(
      [
        { a: 1, b: 2, c: 3 },
        ['a'],
        { a: 11, b: 12, c: 13, d: 14 },
        null,
        { a: 21, b: 22, c: 23 },
      ],
      [
        {
          condition: 'a',
          strategy: (current: any, value: any) => {
            if (current == undefined || current < value) {
              return value;
            }
          },
        },
        {
          condition: /^b$/,
          strategy: (current: any, value: any) => {
            if (current == undefined || current > value) {
              return value;
            }
          },
        },
        {
          condition: (key: PropertyKey, _value: unknown) => key === 'c',
          strategy: (current: any, value: any) => {
            if (current == undefined) {
              return value;
            } else {
              return current + value;
            }
          },
        },
      ],
      { excludeUnmatched: true },
    );
    expect(result).toEqual({ a: 21, b: 2, c: 39 });
  });

  test('Function replaces the result', () => {
    const received: unknown[] = [];
    const result = mergeObject<any, any>(
      [
        { a: 1, b: 2 },
        (current: any) => {
          received.push(current);
          return { a: current.a };
        },
        { c: 3 },
      ],
      [],
    );
    expect(received).toEqual([{ a: 1, b: 2 }]);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  test('Nested properties are not merged into the result', () => {
    const result = mergeObject<any, any>(
      [{ x: { a: 1 } }],
      [{ condition: 'a', strategy: (_current: any, value: any) => value }],
      { excludeUnmatched: true },
    );
    expect(result).toEqual({});
  });

  test('initialValue of the strategy item', () => {
    const result = mergeObject<any, any>(
      [{ a: 1 }, { a: 2 }],
      [
        {
          condition: 'a',
          initialValue: () => [],
          strategy: (current: any, value: any) => [...current, value],
        },
      ],
    );
    expect(result).toEqual({ a: [1, 2] });
  });

  test('Does not mutate the arguments', () => {
    const initial = { a: 1 };
    const object = { b: 2 };
    const result = mergeObject<any, any>([object, { c: 3 }], [], {
      initialValue: initial,
    });
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
    expect(initial).toEqual({ a: 1 });
    expect(object).toEqual({ b: 2 });
  });
});
