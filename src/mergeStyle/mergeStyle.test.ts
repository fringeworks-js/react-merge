import mergeStyle from './mergeStyle';

describe('mergeStyle', () => {
  test('No items', () => {
    const result = mergeStyle();
    expect(result).toEqual({});
  });

  test('Flat', () => {
    const result = mergeStyle(
      { color: '#ffffff' },
      false,
      () => ({ backgroundColor: '#ff0000' }),
      null,
      { color: '#000000' },
      undefined,
    );
    expect(result).toEqual({ color: '#000000', backgroundColor: '#ff0000' });
  });

  test('Nested', () => {
    const result = mergeStyle(
      { color: '#ffffff' },
      false,
      () => ({ backgroundColor: '#ff0000' }),
      [null, { color: '#000000' }, undefined],
    );
    expect(result).toEqual({ color: '#000000', backgroundColor: '#ff0000' });
  });

  test('Function receives the current result', () => {
    const result = mergeStyle({ color: 'red', margin: 0 }, (current) => ({
      color: current.color,
    }));
    expect(result).toEqual({ color: 'red' });
  });

  test('Undefined values do not overwrite', () => {
    const result = mergeStyle({ color: 'red' }, { color: undefined });
    expect(result).toEqual({ color: 'red' });
  });

  test('Does not mutate the arguments', () => {
    const style = { color: 'red' };
    mergeStyle(style, { margin: 0 });
    expect(style).toEqual({ color: 'red' });
  });
});
