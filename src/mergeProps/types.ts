import type { CSSProperties, Ref } from 'react';
import type { ClassNameValue } from '../mergeClassName';
import type { RefValue } from '../mergeRef';
import type { StyleValue } from '../mergeStyle';

export type PropsValue<PROPS, REF> =
  | PropsArray<PROPS, REF>
  | Props<PROPS, REF>
  | ((currentResult: PropsResult<PROPS, REF>) => PropsResult<PROPS, REF>)
  | boolean
  | null
  | undefined;

export type PropsArray<PROPS, REF> = Array<PropsValue<PROPS, REF>>;

/**
 * マージした結果\
 * 渡したプロパティに PROPS の必須のプロパティがそろっているかは確認しない
 */
export type PropsResult<PROPS, REF> = PROPS & {
  ref?: Ref<REF>;
  className?: string;
  style?: CSSProperties;
};

type Props<PROPS, REF> = Partial<Omit<PROPS, 'ref' | 'className' | 'style'>> & {
  ref?: RefValue<REF>;
  className?: ClassNameValue;
  style?: StyleValue;
};
