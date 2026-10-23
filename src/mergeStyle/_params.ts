import { assignDefined } from '@fringeworks/utils/object/assignDefined';
import { isFunction, isPlainObject } from 'remeda';
import type { StyleResult, StyleValue } from './types';

export function styleStrategy(
  currentResult: StyleResult | undefined,
  value: StyleValue,
): StyleResult | undefined {
  if (isFunction(value)) {
    // 関数の場合は、戻り値で結果を置き換える
    return value(currentResult ?? {});
  } else if (isPlainObject(value)) {
    return assignDefined(currentResult ?? {}, value);
  }
  // 配列は mergeValue が要素ごとにマージし、それ以外の値は無視する
  return undefined;
}

export function styleInitialValue(): StyleResult {
  return {};
}
