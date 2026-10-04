import setRefCurrent from '@fringeworks/react-utils/utils/setRefCurrent';
import type { Ref } from 'react';
import { isFunction, isPlainObject } from 'remeda';
import type { RefResult, RefValue } from './types';

export function refStrategy<T>(
  currentResult: RefResult<T>,
  value: RefValue<T>,
): RefResult<T> | undefined {
  if (isRef(value)) {
    return (target: T) => setRefCurrent(target, currentResult, value);
  }
}

export const refInitialValue = undefined;

function isRef<T>(value: RefValue<T>): value is Ref<T> {
  return (
    (isPlainObject(value) && 'current' in (value as object)) ||
    isFunction(value)
  );
}
