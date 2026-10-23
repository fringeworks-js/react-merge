import type { InitialValueFn, MergeValueOptions } from '../mergeValue';

// 引数の位置で使うため、既定値を unknown にすると具体的な型の処理を受け付けなくなる
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MergeStrategyItem<V = any, R = any> = {
  /**
   * 下記の条件に合致したときにstrategyを実行する
   * 未指定の場合は無条件で実行される
   *
   * - string: プロパティのキーと完全に合致する場合
   * - RegExp: プロパティのキーが正規表現にマッチする場合
   * - function: 関数がtrueを返す場合
   */
  condition?: MergeCondition;

  /**
   * 結果にまだ値が無い（undefined の）ときに使う初期値
   */
  initialValue?: R | InitialValueFn<R>;

  /**
   * マージ処理\
   * undefined 以外を返すと、その値を結果のプロパティに設定する。undefined を返した場合は何もしない
   */
  strategy: (currentValue: R, value: V, key: string) => R | undefined;
};

/**
 * マージ要否判定条件
 */
export type MergeCondition =
  string | RegExp | ((key: string, value: unknown) => boolean);

// 引数の位置で使うため、既定値を unknown にすると具体的な型の処理を受け付けなくなる
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MergeObjectOptions<R = any> = MergeValueOptions<R> & {
  /**
   * MergeStrategyItemが適用されなかったものは結果に反映しない
   */
  excludeUnmatched?: boolean;
};
