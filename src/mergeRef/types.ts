import type { RefCallback, RefObject } from 'react';

export type RefValue<T> =
  | RefArray<T>
  | RefCallback<T>
  | RefObject<T | null>
  | boolean
  | null
  | undefined;

export type RefArray<T> = Array<RefValue<T>>;

export type RefResult<T> = RefCallback<T>;
