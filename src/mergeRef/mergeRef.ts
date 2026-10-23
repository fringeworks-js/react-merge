import mergeValue from '../mergeValue';
import { refStrategy } from './_params';
import type { RefResult, RefValue } from './types';

/**
 * refのマージを行う関数
 * @param refList
 * @returns 渡した全ての ref に値を設定する RefCallback。ref が無ければ undefined
 */
export default function mergeRef<T>(
  ...refList: RefValue<T>[]
): RefResult<T> | undefined {
  return mergeValue<RefValue<T>, RefResult<T>>(refList, refStrategy<T>);
}
