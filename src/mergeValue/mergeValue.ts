import type {
  CurrentStatus,
  InitailValueFn,
  MergeStrategy,
  MergeValueOptions,
} from './types';

/**
 * 値のマージを行う汎用的な関数
 * @param valueList 処理対象の値
 * @param strategy マージ処理
 * @param options オプション
 * @returns
 */
export default function mergeValue<V, R>(
  valueList: V[],
  strategy: MergeStrategy<V, R>,
  options: MergeValueOptions<V, R> = {},
): R {
  return _mergeArray(valueList, strategy, options);
}

function _mergeValue<V, R>(
  values: V | V[],
  strategy: MergeStrategy<V, R>,
  options: MergeValueOptions<V, R> = {},
  status: CurrentStatus = {},
): R {
  const { initialValue } = options;

  let currentResult: R =
    typeof initialValue === 'function'
      ? (initialValue as InitailValueFn<V, R>)(values, status)
      : // initialValue を省略した場合は undefined から始める
        (initialValue as R);

  const strategyResult = strategy(currentResult, values, status);
  if (strategyResult !== undefined) {
    // マージ対象の場合はstrategyを適用
    currentResult = strategyResult;
  } else if (typeof values === 'object') {
    if (Array.isArray(values)) {
      // 配列の場合は、各要素に対して再帰的にマージ
      currentResult = _mergeArray(values, strategy, options, status);
    } else if (values) {
      // オブジェクトの場合は、各キーの値に対して再帰的にマージ
      for (const key in values) {
        const subResult = _mergeValue(values[key] as V, strategy, options, {
          key,
        });
        const subStrategyResult = strategy(currentResult, subResult, status);
        if (subStrategyResult !== undefined) {
          currentResult = subStrategyResult;
        }
      }
    }
  }

  return currentResult;
}

function _mergeArray<V, R>(
  values: V[],
  strategy: MergeStrategy<V, R>,
  options: MergeValueOptions<V, R> = {},
  status: CurrentStatus = {},
): R {
  const { initialValue } = options;
  let currentResult: R =
    typeof initialValue === 'function'
      ? (initialValue as InitailValueFn<V, R>)(values, status)
      : // initialValue を省略した場合は undefined から始める
        (initialValue as R);

  for (const [index, value] of values.entries()) {
    const subResult = _mergeValue(value, strategy, options, { index });
    const subStrategyResult = strategy(currentResult, subResult, status);
    if (subStrategyResult !== undefined) {
      currentResult = subStrategyResult;
    }
  }

  return currentResult;
}
