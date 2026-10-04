import maybeAssign from '@fringeworks/utils/object/maybeAssign';
import { isFunction, isPlainObject } from 'remeda';
import type { StyleResult, StyleValue } from './types';

export function styleStrategy(
  currentResult: StyleResult,
  value: StyleValue,
): StyleResult | undefined {
  if (isFunction(value)) {
    return maybeAssign(currentResult, value(currentResult));
  } else if (isPlainObject(value)) {
    return maybeAssign(currentResult, value);
  }
}

export function styleInitialValue() {
  return {} as StyleResult;
}
