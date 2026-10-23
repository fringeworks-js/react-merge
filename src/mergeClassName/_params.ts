import clsx from 'clsx';
import { isFunction, isString } from 'remeda';
import type { ClassNameResult, ClassNameValue } from './types';

export function classNameStrategy(
  currentResult: ClassNameResult | undefined,
  value: ClassNameValue,
): ClassNameResult | undefined {
  if (isFunction(value)) {
    // 関数の場合は、戻り値で結果を置き換える
    return value(currentResult ?? '');
  } else if (isString(value)) {
    return clsx(currentResult, value);
  }
  // 配列は mergeValue が要素ごとにマージし、それ以外の値は無視する
  return undefined;
}

export const classNameInitialValue = '';
