import clsx from 'clsx';
import type { ClassNameResult, ClassNameValue } from './types';

export function classNameStrategy(
  currentResult: ClassNameResult,
  value: ClassNameValue,
): ClassNameResult | undefined {
  return clsx(currentResult, value);
}

export const classNameInitialValue = '';
