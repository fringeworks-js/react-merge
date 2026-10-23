import type { InitialValueFn, MergeStrategy, MergeValueOptions } from './types';

/**
 * 値のマージを行う汎用的な関数\
 * 初期値から始めて、各値に strategy を順に適用する。
 * strategy が undefined を返した値は、配列なら各要素を再帰的にマージし、それ以外は無視する
 * @param valueList 処理対象の値
 * @param strategy マージ処理
 * @param options オプション
 * @returns マージした結果。initialValue を省略した場合、マージする値が無ければ undefined
 */
export default function mergeValue<V, R>(
  valueList: readonly V[],
  strategy: MergeStrategy<V, R>,
  options: MergeValueOptions<R> & { initialValue: R | InitialValueFn<R> },
): R;
export default function mergeValue<V, R>(
  valueList: readonly V[],
  strategy: MergeStrategy<V, R | undefined>,
  options?: MergeValueOptions<R>,
): R | undefined;
export default function mergeValue<V, R>(
  valueList: readonly V[],
  strategy: MergeStrategy<V, R | undefined>,
  options: MergeValueOptions<R> = {},
): R | undefined {
  const { initialValue } = options;
  // initialValue を省略した場合は undefined から始める
  const currentResult =
    typeof initialValue === 'function'
      ? (initialValue as InitialValueFn<R>)()
      : initialValue;
  return mergeList(currentResult, valueList, strategy);
}

function mergeList<V, R>(
  currentResult: R,
  valueList: readonly V[],
  strategy: MergeStrategy<V, R>,
): R {
  let result = currentResult;
  for (const value of valueList) {
    const strategyResult = strategy(result, value);
    if (strategyResult !== undefined) {
      result = strategyResult;
    } else if (Array.isArray(value)) {
      // strategy が扱わなかった配列は、各要素を順にマージする
      result = mergeList(result, value as readonly V[], strategy);
    }
  }
  return result;
}
