/**
 * 値をマージする処理\
 * undefined 以外を返すと、その値が次の currentResult になる。
 * undefined を返した場合、value が配列なら各要素を順にマージし、それ以外の値は無視する
 *
 * @param currentResult 現在の結果
 * @param value マージする値
 */
// 引数の位置で使うため、既定値を unknown にすると具体的な型の処理を受け付けなくなる
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MergeStrategy<V = any, R = any> = (
  currentResult: R,
  value: V,
) => R | undefined;

// 引数の位置で使うため、既定値を unknown にすると具体的な型の処理を受け付けなくなる
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MergeValueOptions<R = any> = {
  /**
   * 初期値\
   * 関数を渡した場合は、呼び出した結果を初期値にする（結果が関数の場合は、関数を返す関数を渡す）
   */
  initialValue?: R | InitialValueFn<R>;
};

/**
 * 初期値を返す関数
 */
// 引数の位置で使うため、既定値を unknown にすると具体的な型の処理を受け付けなくなる
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InitialValueFn<R = any> = () => R;
