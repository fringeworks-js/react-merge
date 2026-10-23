import mergeValue from '../mergeValue';
import { classNameInitialValue, classNameStrategy } from './_params';
import type { ClassNameResult, ClassNameValue } from './types';

/**
 * クラスのマージを行う関数
 * @param classNameList
 * @returns
 */
export default function mergeClassName(
  ...classNameList: ClassNameValue[]
): ClassNameResult {
  return mergeValue<ClassNameValue, ClassNameResult>(
    classNameList,
    classNameStrategy,
    {
      initialValue: classNameInitialValue,
    },
  );
}
