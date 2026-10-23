import type { CSSProperties } from 'react';

export type StyleValue =
  | StyleArray
  | CSSProperties
  | ((currentResult: StyleResult) => StyleResult)
  | boolean
  | null
  | undefined;

export type StyleArray = Array<StyleValue>;

export type StyleResult = CSSProperties;
