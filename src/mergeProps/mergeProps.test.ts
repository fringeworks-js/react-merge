import mergeProps from './mergeProps';

describe('mergeProps', () => {
  test('No items', () => {
    const result = mergeProps<any, any>();
    expect(result).toEqual({});
  });

  test('object', () => {
    const ref1 = { current: null };
    const ref2 = { current: null };
    const ref2Fn = (value: any) => {
      ref2.current = value;
    };
    const ref3 = { current: null };
    const style1 = { color: 'red', backgroundColor: 'green' };
    const style2 = { backgroundImage: './img.jpg' };
    const style3 = { backgroundColor: 'blue' };
    const value1: { current: unknown } = { current: null };
    const onChange1 = (value: unknown) => {
      value1.current = value;
    };
    const value3: { current: unknown } = { current: null };
    const onChange3 = (value: unknown) => {
      value3.current = value;
    };
    const result = mergeProps<any, any>(
      {
        id: 'A',
        className: 'a',
        ref: ref1,
        style: style1,
        onChange: onChange1,
      },
      { id: 'B' },
      { id: 'C', className: 'c', ref: ref2Fn, style: style2 },
      {
        id: 'D',
        className: 'd',
        ref: ref3,
        style: style3,
        onChange: onChange3,
      },
    );
    const refCurrent = {};
    result.ref(refCurrent);
    const valueCurrent = {};
    result.onChange(valueCurrent);
    expect(result.id).toBe('D');
    expect(result.className).toBe('a c d');
    expect(ref1.current).toBe(refCurrent);
    expect(ref2.current).toBe(refCurrent);
    expect(ref3.current).toBe(refCurrent);
    expect(result.style).toEqual({
      color: 'red',
      backgroundColor: 'blue',
      backgroundImage: './img.jpg',
    });
    expect(value1.current).toBe(valueCurrent);
    expect(value3.current).toBe(valueCurrent);
  });

  test('Function receives the current result', () => {
    const handler = vi.fn();
    const result = mergeProps<any, any>(
      { id: 'A', className: 'a', onClick: handler },
      (current: any) => ({ ...current, id: 'B' }),
    );
    result.onClick();
    expect(handler).toHaveBeenCalledTimes(1);
    expect(result.className).toBe('a');
    expect(result.id).toBe('B');
  });

  test('Function can remove properties', () => {
    const result = mergeProps<any, any>(
      { id: 'A', onClick: () => {} },
      ({ onClick: _onClick, ...rest }: any) => rest,
    );
    expect(result).toEqual({ id: 'A' });
  });

  test('Empty values do not overwrite special properties', () => {
    const handler = vi.fn();
    const ref = { current: null };
    const result = mergeProps<any, any>(
      { onClick: handler, ref, className: 'a', style: { color: 'red' } },
      { onClick: null, ref: null, className: null, style: null },
      { onClick: undefined, ref: false, className: false, style: false },
    );
    expect(result.onClick).toBe(handler);
    expect(result.className).toBe('a');
    expect(result.style).toEqual({ color: 'red' });
    result.ref('value');
    expect(ref.current).toBe('value');
  });

  test('Special properties are not added without values', () => {
    const result = mergeProps<any, any>({
      id: 'A',
      className: undefined,
      style: null,
      ref: null,
      onClick: null,
    });
    expect(result).toEqual({ id: 'A' });
  });

  test('Other properties: undefined is ignored, null overwrites', () => {
    const result = mergeProps<any, any>(
      { title: 'a', value: 'b' },
      { title: undefined, value: null },
    );
    expect(result).toEqual({ title: 'a', value: null });
  });

  test('Arrays in special properties', () => {
    const ref1 = { current: null };
    const ref2 = { current: null };
    const result = mergeProps<any, any>(
      { className: 'a', style: { color: 'red' } },
      {
        className: ['b', [null, 'c']],
        style: [{ margin: 0 }, null],
        ref: [ref1, [ref2]],
      },
    );
    expect(result.className).toBe('a b c');
    expect(result.style).toEqual({ color: 'red', margin: 0 });
    result.ref('value');
    expect(ref1.current).toBe('value');
    expect(ref2.current).toBe('value');
  });

  test('Non-function on* values are treated as normal properties', () => {
    const handler = vi.fn();
    const result = mergeProps<any, any>(
      { onLabel: 'label' },
      { onLabel: handler },
    );
    expect(result.onLabel).toBe(handler);
  });
});
