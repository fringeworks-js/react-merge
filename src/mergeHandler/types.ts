export type HandlerValue =
  HandlerArray | HandlerFn | boolean | null | undefined;

export type HandlerArray = Array<HandlerValue>;

/**
 * まとめたハンドラー\
 * 渡したハンドラーを順に呼び出し、最後のハンドラーの戻り値を返す
 */
export type HandlerResult = HandlerFn;

/**
 * ハンドラー\
 * 引数の型を問わずにまとめられるよう、引数は any にしている
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HandlerFn = (...args: any[]) => unknown;
