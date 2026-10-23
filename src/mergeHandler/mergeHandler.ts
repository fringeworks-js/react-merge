import mergeValue from '../mergeValue';
import { handlerStrategy } from './_params';
import type { HandlerResult, HandlerValue } from './types';

/**
 * ハンドラーのマージを行う関数
 * @param handlerList
 * @returns 渡したハンドラーを順に呼び出す関数。ハンドラーが無ければ undefined
 */
export default function mergeHandler(
  ...handlerList: HandlerValue[]
): HandlerResult | undefined {
  return mergeValue<HandlerValue, HandlerResult>(handlerList, handlerStrategy);
}
