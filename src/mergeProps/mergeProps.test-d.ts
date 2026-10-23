import { createRef, type ComponentProps } from 'react';
import { describe, expectTypeOf, it } from 'vitest';
import mergeProps from './mergeProps';

type ButtonProps = { label: string; disabled?: boolean };

describe('mergeProps', () => {
  it('必須のプロパティが無い要素も受け付ける', () => {
    const props: ButtonProps = { label: 'OK' };
    const result = mergeProps<ButtonProps, HTMLButtonElement>(
      { disabled: true },
      props,
    );
    expectTypeOf(result.label).toEqualTypeOf<string>();
  });

  it('ref・className・style にマージ用の値を渡せる', () => {
    mergeProps<ComponentProps<'div'>, HTMLDivElement>(
      { ref: createRef<HTMLDivElement>(), className: ['a', false] },
      { style: [{ color: 'red' }, null], onClick: () => {} },
      (current) => ({ ...current, id: 'x' }),
    );
  });

  it('プロパティの型が違う値は受け付けない', () => {
    // @ts-expect-error label は string
    mergeProps<ButtonProps, HTMLButtonElement>({ label: 1 });
  });
});
