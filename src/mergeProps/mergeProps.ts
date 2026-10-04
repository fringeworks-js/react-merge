import { isFunction, isString } from 'remeda';
import {
  classNameInitialValue,
  classNameStrategy,
} from '../mergeClassName/params';
import { handlerInitialValue, handlerStrategy } from '../mergeHandler/params';
import mergeObject from '../mergeObject';
import { refInitialValue, refStrategy } from '../mergeRef/params';
import { styleInitialValue, styleStrategy } from '../mergeStyle/params';
import type { PropsResult, PropsValue } from './types';

const handlerRegexp = /^on[A-Z].*$/;

/**
 * プロパティのマージを行う関数
 * @param propsList
 * @returns
 */
export default function mergeProps<PROPS, REF>(
  ...propsList: PropsValue<PROPS, REF>[]
): PropsResult<PROPS, REF> {
  return mergeObject<PropsValue<PROPS, REF>, PropsResult<PROPS, REF>>(
    propsList,
    [
      {
        condition: (key, value) =>
          isString(key) && handlerRegexp.test(key) && isFunction(value),
        strategy: handlerStrategy,
        initialValue: handlerInitialValue,
      },
      {
        condition: 'ref',
        strategy: refStrategy,
        initialValue: refInitialValue,
      },
      {
        condition: 'className',
        strategy: classNameStrategy,
        initialValue: classNameInitialValue,
      },
      {
        condition: 'style',
        strategy: styleStrategy,
        initialValue: styleInitialValue,
      },
      {
        strategy: (_current, value) => value,
      },
    ],
    {
      // 初期値は空オブジェクト
      initialValue: () => ({}) as PropsResult<PROPS, REF>,
    },
  );
}
