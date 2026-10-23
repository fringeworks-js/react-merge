import { isFunction } from 'remeda';
import type { HandlerResult, HandlerValue } from './types';

export function handlerStrategy(
  currentResult: HandlerResult | undefined,
  value: HandlerValue,
): HandlerResult | undefined {
  if (!isFunction(value)) {
    // 配列は mergeValue が要素ごとにマージし、それ以外の値は無視する
    return undefined;
  } else if (!isFunction(currentResult)) {
    return value;
  }
  // 順に呼び出し、最後のハンドラーの戻り値を返す
  return (...args: unknown[]) => {
    currentResult(...args);
    return value(...args);
  };
}
