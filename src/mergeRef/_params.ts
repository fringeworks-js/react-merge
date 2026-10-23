import setRefCurrent from '@fringeworks/react-utils/utils/setRefCurrent';
import type { RefCallback, RefObject } from 'react';
import { isFunction, isPlainObject } from 'remeda';
import type { RefResult, RefValue } from './types';

export function refStrategy<T>(
  currentResult: RefResult<T> | undefined,
  value: RefValue<T>,
): RefResult<T> | undefined {
  if (!isRef(value)) {
    // 配列は mergeValue が要素ごとにマージし、それ以外の値は無視する
    return undefined;
  } else if (currentResult === undefined && isFunction(value)) {
    return value;
  }
  return (target: T | null) => setRefCurrent(target, currentResult, value);
}

function isRef<T>(
  value: RefValue<T>,
): value is RefCallback<T> | RefObject<T | null> {
  return (
    (isPlainObject(value) && 'current' in (value as object)) ||
    isFunction(value)
  );
}
