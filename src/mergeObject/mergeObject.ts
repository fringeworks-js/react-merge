import { isFunction, isPlainObject } from 'remeda';
import mergeValue from '../mergeValue';
import type {
  MergeCondition,
  MergeObjectOptions,
  MergeStrategyItem,
} from './types';

/**
 * オブジェクトのプロパティ値のマージを行う汎用的な関数
 * @param objectList 処理対象の値
 * @param strategies マージ処理
 * @param options オプション
 * @returns
 */
export default function mergeObject<O, R>(
  objectList: O[],
  strategies: MergeStrategyItem[],
  options: MergeObjectOptions<O, R> = {},
): R {
  const { initialValue = () => ({}) as R, excludeUnmatched = false } = options;
  return mergeValue<O, R>(
    objectList,
    (currentResult, value) => {
      if (isFunction(value)) {
        return _mergeObject(
          currentResult,
          (value as (...args: unknown[]) => unknown)(currentResult),
          strategies,
          excludeUnmatched,
        );
      } else if (isPlainObject(value)) {
        return _mergeObject(currentResult, value, strategies, excludeUnmatched);
      }
    },
    {
      initialValue,
    },
  );
}

function _mergeObject<O>(
  currentResult: any,
  object: O,
  strategies: MergeStrategyItem[],
  excludeUnmatched: boolean,
) {
  let isMerged = false;
  for (const key in object) {
    const value: any = object[key];
    let isMatched = false;
    for (const { condition, initialValue, strategy } of strategies) {
      if (_matchCondition(condition, key, value)) {
        isMatched = true;
        let currentValue = currentResult[key];
        if (currentValue === undefined) {
          if (isFunction(initialValue)) {
            currentValue = (initialValue as (...args: unknown[]) => unknown)();
          } else if (initialValue !== undefined) {
            currentValue = initialValue;
          }
        }
        const result = strategy(currentValue, value, { key });
        if (result !== undefined) {
          // マージ対象の場合はstrategyを適用
          currentResult[key] = result;
          isMerged = true;
        }
        break;
      }
    }
    if (!isMatched && !excludeUnmatched) {
      currentResult[key] = value;
    }
  }
  return isMerged ? currentResult : undefined;
}

function _matchCondition(
  condition: MergeCondition | undefined,
  key: PropertyKey,
  value: unknown,
): boolean {
  if (!condition) {
    return true;
  } else if (typeof condition === 'string') {
    return key === condition;
  } else if (condition instanceof RegExp) {
    return condition.test(String(key));
  } else if (isFunction(condition)) {
    return condition(key, value);
  }
  return false;
}
