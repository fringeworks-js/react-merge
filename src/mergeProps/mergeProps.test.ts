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
});
