import { isFunction } from 'remeda';
import { classNameStrategy } from '../mergeClassName/_params';
import { handlerStrategy } from '../mergeHandler/_params';
import mergeObject from '../mergeObject';
import { refStrategy } from '../mergeRef/_params';
import { styleStrategy } from '../mergeStyle/_params';
import mergeValue, { type MergeStrategy } from '../mergeValue';
import type { PropsResult, PropsValue } from './types';

const handlerKeyRegexp = /^on[A-Z]/;

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
        // on から始まるプロパティは、関数をハンドラーとしてまとめ、null などの値を無視する
        condition: (key, value) =>
          handlerKeyRegexp.test(key) && (isFunction(value) || isEmpty(value)),
        strategy: createPropertyStrategy(handlerStrategy),
      },
      {
        condition: 'ref',
        strategy: createPropertyStrategy(refStrategy),
      },
      {
        condition: 'className',
        strategy: createPropertyStrategy(classNameStrategy),
      },
      {
        condition: 'style',
        strategy: createPropertyStrategy(styleStrategy),
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

/**
 * 単体の関数（mergeClassName など）と同じ規則でプロパティの値をマージする処理を作る\
 * 値が配列の場合も同じ結果になるよう、mergeValue を通してマージする
 */
function createPropertyStrategy<V, R>(
  strategy: MergeStrategy<V, R | undefined>,
) {
  return (currentValue: R | undefined, value: V): R | undefined =>
    // 結果が関数（ハンドラーや ref）の場合に初期値として呼び出されないよう、関数で包んで渡す
    mergeValue([value], strategy, { initialValue: () => currentValue });
}

function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || typeof value === 'boolean';
}
