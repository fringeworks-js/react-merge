import setRefCurrent from '@fringeworks/react-utils/utils/setRefCurrent';
import type { MutableRefObject, RefCallback } from 'react';
import { isFunction, isPlainObject } from 'remeda';
import type { RefResult, RefValue } from './types';

export function refStrategy<T>(
  currentResult: RefResult<T>,
  value: RefValue<T>,
): RefResult<T> | undefined {
  if (isRef(value)) {
    return (target: T) => setRefCurrent(target, currentResult, value);
  }
  return undefined;
}

export const refInitialValue = undefined;

function isRef<T>(
  value: RefValue<T>,
): value is RefCallback<T> | MutableRefObject<T> {
  return (
    (isPlainObject(value) && 'current' in (value as object)) ||
    isFunction(value)
  );
}
