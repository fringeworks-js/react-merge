import { isFunction } from 'remeda';
import type { HandlerResult, HandlerValue } from './types';

export function handlerStrategy<_T>(
  currentResult: HandlerResult,
  value: HandlerValue,
): HandlerResult | undefined {
  if (isFunction(value)) {
    return (...args: unknown[]) => {
      currentResult?.(...args);
      value(...args);
    };
  }
  return undefined;
}

export const handlerInitialValue = undefined;
