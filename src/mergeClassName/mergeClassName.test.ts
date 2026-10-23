import mergeClassName from './mergeClassName';

describe('mergeClassName', () => {
  test('No items', () => {
    const result = mergeClassName();
    expect(result).toBe('');
  });

  test('Flat', () => {
    const result = mergeClassName('a', false, 'b', null, 'c', undefined);
    expect(result).toBe('a b c');
  });

  test('Nested', () => {
    const result = mergeClassName('a', false, 'b', [null, 'c', undefined]);
    expect(result).toBe('a b c');
  });

  test('Function replaces the result', () => {
    const result = mergeClassName('a', (current) => `${current} b`, 'c');
    expect(result).toBe('a b c');
  });

  test('Function can remove classes', () => {
    const result = mergeClassName('a b', [
      (current) => current.replace('a', ''),
    ]);
    expect(result).toBe(' b');
  });
});
