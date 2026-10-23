import type { MutableRefObject, RefCallback } from 'react';
import mergeRef from './mergeRef';

describe('mergeRef', () => {
  test('No items', () => {
    const result = mergeRef();
    expect(result).toBeUndefined();
  });

  test('Flat', () => {
    const refObject1: MutableRefObject<any> = { current: null };
    const refObject2: MutableRefObject<any> = { current: null };
    const refCallbackResult1: MutableRefObject<any> = { current: null };
    const refCallbackResult2: MutableRefObject<any> = { current: null };
    const refCallback1: RefCallback<any> = (value) => {
      refCallbackResult1.current = value;
    };
    const refCallback2: RefCallback<any> = (value) => {
      refCallbackResult2.current = value;
    };
    const result = mergeRef([
      refObject1,
      refCallback1,
      null,
      refObject2,
      refCallback2,
      undefined,
    ]);
    const current = {};
    result!(current);
    expect(refObject1.current).toBe(current);
    expect(refObject2.current).toBe(current);
    expect(refCallbackResult1.current).toBe(current);
    expect(refCallbackResult2.current).toBe(current);
  });

  test('Nested', () => {
    const refObject1: MutableRefObject<any> = { current: null };
    const refObject2: MutableRefObject<any> = { current: null };
    const refCallbackResult1: MutableRefObject<any> = { current: null };
    const refCallbackResult2: MutableRefObject<any> = { current: null };
    const refCallback1: RefCallback<any> = (value) => {
      refCallbackResult1.current = value;
    };
    const refCallback2: RefCallback<any> = (value) => {
      refCallbackResult2.current = value;
    };
    const result = mergeRef([
      refObject1,
      refCallback1,
      null,
      [refObject2, refCallback2, undefined],
    ]);
    const current = {};
    result!(current);
    expect(refObject1.current).toBe(current);
    expect(refObject2.current).toBe(current);
    expect(refCallbackResult1.current).toBe(current);
    expect(refCallbackResult2.current).toBe(current);
  });

  test('Single callback ref is returned as is', () => {
    const ref: RefCallback<any> = () => {};
    expect(mergeRef(null, ref)).toBe(ref);
  });

  test('Cleanup', () => {
    const refObject: MutableRefObject<any> = { current: null };
    const cleanup = vi.fn();
    const refCallback = vi.fn(() => cleanup);
    const legacyCallback = vi.fn();
    const result = mergeRef(refObject, refCallback, legacyCallback);
    const current = {};
    const returnedCleanup = result!(current) as () => void;
    expect(refObject.current).toBe(current);

    returnedCleanup();
    expect(refObject.current).toBeNull();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(legacyCallback).toHaveBeenLastCalledWith(null);
  });
});
