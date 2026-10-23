import { createRef, type RefCallback } from 'react';
import { describe, expectTypeOf, it } from 'vitest';
import mergeRef from './mergeRef';

describe('mergeRef', () => {
  it('useRef(null) などで作った RefObject を受け付ける', () => {
    const refObject = createRef<HTMLDivElement>();
    const refCallback: RefCallback<HTMLDivElement> = () => {};
    expectTypeOf(
      mergeRef<HTMLDivElement>(refObject, refCallback, [null, false]),
    ).toEqualTypeOf<RefCallback<HTMLDivElement> | undefined>();
  });
});
