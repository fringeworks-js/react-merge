import mergeValue from '../mergeValue';
import { styleInitialValue, styleStrategy } from './_params';
import type { StyleResult, StyleValue } from './types';

/**
 * スタイルのマージを行う関数
 * @param styleList
 * @returns
 */
export default function mergeStyle(...styleList: StyleValue[]): StyleResult {
  return mergeValue<StyleValue, StyleResult>(styleList, styleStrategy, {
    initialValue: styleInitialValue,
  });
}
