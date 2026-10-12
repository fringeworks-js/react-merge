export type HandlerValue =
  | HandlerArray
  | HandlerFn
  | boolean
  | null
  | undefined;

export type HandlerArray = Array<HandlerValue>;

/**
 * まとめたハンドラー
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HandlerResult = (...args: any[]) => void;

/**
 * ハンドラー\
 * 引数の型を問わずにまとめられるよう、引数は any にしている
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HandlerFn = (...args: any[]) => unknown;
