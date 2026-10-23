import { isFunction, isPlainObject } from 'remeda';
import mergeValue from '../mergeValue';
import type {
  MergeCondition,
  MergeObjectOptions,
  MergeStrategyItem,
} from './types';

/**
 * オブジェクトのプロパティ値のマージを行う汎用的な関数\
 * オブジェクトは、プロパティごとに条件に合う strategy でマージする。
 * 関数は、それまでの結果を引数に呼び出し、戻り値で結果を置き換える
 * @param objectList 処理対象の値
 * @param strategies マージ処理
 * @param options オプション
 * @returns
 */
export default function mergeObject<O, R>(
  objectList: readonly O[],
  strategies: readonly MergeStrategyItem[],
  options: MergeObjectOptions<R> = {},
): R {
  const { initialValue = () => ({}) as R, excludeUnmatched = false } = options;
  return mergeValue<O, R>(
    objectList,
    (currentResult, value) => {
      if (isFunction(value)) {
        return (value as (currentResult: R) => R)(currentResult);
      } else if (isPlainObject(value)) {
        return mergeProperties(
          currentResult,
          value,
          strategies,
          excludeUnmatched,
        );
      }
      return undefined;
    },
    { initialValue },
  );
}

function mergeProperties<R>(
  currentResult: R,
  object: Readonly<Record<string, unknown>>,
  strategies: readonly MergeStrategyItem[],
  excludeUnmatched: boolean,
): R {
  // 初期値や関数の戻り値として渡されたオブジェクトを書き換えないよう、複製してから書き込む
  const result: Record<string, unknown> = { ...(currentResult as object) };
  for (const [key, value] of Object.entries(object)) {
    const item = strategies.find(({ condition }) =>
      matchCondition(condition, key, value),
    );
    if (item) {
      const { initialValue, strategy } = item;
      let currentValue = result[key];
      if (currentValue === undefined) {
        currentValue = isFunction(initialValue)
          ? (initialValue as () => unknown)()
          : initialValue;
      }
      const strategyResult = strategy(currentValue, value, key);
      if (strategyResult !== undefined) {
        result[key] = strategyResult;
      }
    } else if (!excludeUnmatched) {
      result[key] = value;
    }
  }
  return result as R;
}

function matchCondition(
  condition: MergeCondition | undefined,
  key: string,
  value: unknown,
): boolean {
  if (!condition) {
    return true;
  } else if (typeof condition === 'string') {
    return key === condition;
  } else if (condition instanceof RegExp) {
    return condition.test(key);
  }
  return condition(key, value);
}
