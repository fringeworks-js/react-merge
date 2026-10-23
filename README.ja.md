# @fringeworks/react-merge

`@fringeworks/react-merge` は React のプロパティ（`className`・`style`・`ref`・イベントハンドラーなど）をマージする、誰かにとっては便利なライブラリです。

**[English README is available here](./README.md)**

## インストール

```bash
npm install @fringeworks/react-merge
# または
pnpm add @fringeworks/react-merge
```

## 使い方

関数・型は、ルートと関数単位のパスのどちらからでも同じ名前で import できます。関数単位のパスでは、その関数を default import することもできます。

```ts
import { mergeProps } from '@fringeworks/react-merge';
import mergeProps from '@fringeworks/react-merge/mergeProps';
```

```tsx
function Button(props: ComponentProps<'button'>) {
  const ref = useRef<HTMLButtonElement>(null);
  const merged = mergeProps<ComponentProps<'button'>, HTMLButtonElement>(
    { type: 'button', className: 'button', ref, onClick: track },
    props,
  );
  // className は連結、style は上書き、ref とハンドラーは全てに渡る
  return <button {...merged} />;
}
```

### マージの規則

どの関数も、渡した値を前から順にマージします。

- 配列は、各要素を同じ規則で順にマージします（ネストしていても構いません）
- `null`・`undefined`・`true`・`false` は何もしません。条件付きの値を `cond && value` の形で渡せます
- 関数（`className`・`style`・プロパティ全体を表すもの）は、それまでの結果を引数に呼び出し、戻り値で結果を置き換えます。値を削除したい場合や、それまでの結果を見て判断したい場合に使います

```ts
mergeClassName('a', ['b', isActive && 'active']); // 'a b active' または 'a b'
mergeStyle({ color: 'red', margin: 0 }, ({ margin, ...rest }) => rest); // { color: 'red' }
```

### ref の作り直しについて

`mergeRef` と `mergeProps` は、呼び出すたびに新しい ref callback を作ります。レンダーの中で呼び出すと、React はレンダーのたびに ref を外して付け直します（callback ref は毎回 `null` と要素で呼ばれます）。

避けたい場合は、[`@fringeworks/react-utils`](https://www.npmjs.com/package/@fringeworks/react-utils) の `useCombinedRefs` で ref をまとめてください。レンダーをまたいで同じ ref callback を返します。`mergeProps` には、ref を取り除いた props と、まとめた ref を渡します。callback ref が1つだけの場合はそのまま結果に入るため、ref callback は作り直されません。

```tsx
const { ref, ...rest } = props;
const combinedRef = useCombinedRefs(localRef, ref);
const merged = mergeProps<Props, HTMLDivElement>(defaults, rest, {
  ref: combinedRef,
});
```

---

## API

| 関数                                            | 説明                                                     |
| ----------------------------------------------- | -------------------------------------------------------- |
| `mergeClassName(...classNameList)`              | クラス名を連結する                                       |
| `mergeHandler(...handlerList)`                  | ハンドラーを順に呼び出す関数にまとめる                   |
| `mergeObject(objectList, strategies, options?)` | オブジェクトをプロパティごとに条件に合う処理でマージする |
| `mergeProps(...propsList)`                      | React のプロパティをマージする                           |
| `mergeRef(...refList)`                          | ref を全てに値を設定する ref callback にまとめる         |
| `mergeStyle(...styleList)`                      | スタイルのオブジェクトをマージする                       |
| `mergeValue(valueList, strategy, options?)`     | 値を順にマージする汎用的な関数                           |

### `mergeClassName`

```ts
mergeClassName(...classNameList: ClassNameValue[]): string
```

クラス名を空白で連結します。値が無い場合は `''` を返します。

```ts
mergeClassName('a', null, ['b', false && 'c']); // 'a b'
mergeClassName('a b', (current) => current.replace('a', '')); // ' b'
```

### `mergeHandler`

```ts
mergeHandler(...handlerList: HandlerValue[]): HandlerResult | undefined
```

ハンドラーを、渡した順に呼び出す1つの関数にまとめます。まとめた関数は、最後のハンドラーの戻り値を返します。ハンドラーが1つだけの場合はそのハンドラーをそのまま返し、1つも無い場合は `undefined` を返します。

```ts
const onClick = mergeHandler(props.onClick, handleClick);
```

### `mergeObject`

```ts
mergeObject<O, R>(
  objectList: readonly O[],
  strategies: readonly MergeStrategyItem[],
  options?: MergeObjectOptions<R>,
): R
```

オブジェクトを、プロパティごとに `strategies` のうち条件に合う最初の処理でマージします。`mergeProps` はこの関数で作っています。結果は書き込む前に複製するため、渡したオブジェクトは変更されません。

| 引数         | 型                             | 説明                                     |
| ------------ | ------------------------------ | ---------------------------------------- |
| `objectList` | `readonly O[]`                 | マージする値                             |
| `strategies` | `readonly MergeStrategyItem[]` | プロパティごとの処理。前にあるものが優先 |
| `options?`   | `MergeObjectOptions<R>`        | 下記のオプション                         |

| オプション          | 型             | 説明                                                                 |
| ------------------- | -------------- | -------------------------------------------------------------------- |
| `initialValue?`     | `R \| () => R` | 初期値。省略した場合は `{}`                                          |
| `excludeUnmatched?` | `boolean`      | 条件に合う処理が無かったプロパティを結果に含めない。既定値は `false` |

`MergeStrategyItem` のプロパティは次のとおりです。

| プロパティ      | 型                                                           | 説明                                                                                                               |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `condition?`    | `MergeCondition`                                             | 処理するプロパティの条件。文字列はキーと一致、正規表現はキーにマッチ、関数は `true` を返すもの。省略した場合は全て |
| `initialValue?` | `R \| () => R`                                               | 結果のプロパティがまだ `undefined` のときに使う値                                                                  |
| `strategy`      | `(currentValue: R, value: V, key: string) => R \| undefined` | マージ処理。`undefined` を返した場合はプロパティを変更しない                                                       |

### `mergeProps`

```ts
mergeProps<PROPS, REF>(...propsList: PropsValue<PROPS, REF>[]): PropsResult<PROPS, REF>
```

React のプロパティをマージします。`PROPS` にはプロパティの型、`REF` には `ref` で受け取る値の型を指定します。各要素は `PROPS` の一部だけを持っていて構いません（必須のプロパティがそろっているかは確認しません）。

| プロパティ                    | マージの方法                                                  |
| ----------------------------- | ------------------------------------------------------------- |
| `className`                   | `mergeClassName` と同じ                                       |
| `style`                       | `mergeStyle` と同じ                                           |
| `ref`                         | `mergeRef` と同じ                                             |
| `on` + 大文字で始まり値が関数 | `mergeHandler` と同じ                                         |
| その他                        | 後の値で上書きする。`undefined` は無視し、`null` は上書きする |

上の4種類のプロパティでは、`null`・`undefined`・`true`・`false` を無視します。値を削除したい場合は、関数を渡して結果を置き換えます。

```ts
mergeProps<Props, HTMLDivElement>(props, ({ onClick, ...rest }) => rest);
```

### `mergeRef`

```ts
mergeRef<T>(...refList: RefValue<T>[]): RefCallback<T> | undefined
```

ref（ref オブジェクトと callback ref）を、全てに値を設定する1つの ref callback にまとめます。callback ref が1つだけの場合はそれをそのまま返し、ref が1つも無い場合は `undefined` を返します。

まとめた ref callback はクリーンアップ関数を返します（React 19）。クリーンアップでは、ref オブジェクトの `current` を `null` に戻し、callback ref が返したクリーンアップ関数を呼びます。クリーンアップ関数を返さない callback ref には `null` を渡します。React 18 では、要素が外れたときにまとめた ref callback に `null` が渡され、全ての ref に `null` が設定されます。

### `mergeStyle`

```ts
mergeStyle(...styleList: StyleValue[]): CSSProperties
```

スタイルのオブジェクトをマージします。後の値が優先され、値が `undefined` のプロパティは上書きしません。値が無い場合は `{}` を返します。渡したオブジェクトは変更しません。

### `mergeValue`

```ts
mergeValue<V, R>(
  valueList: readonly V[],
  strategy: MergeStrategy<V, R>,
  options: { initialValue: R | (() => R) },
): R
mergeValue<V, R>(
  valueList: readonly V[],
  strategy: MergeStrategy<V, R | undefined>,
  options?: MergeValueOptions<R>,
): R | undefined
```

初期値から始めて、各値に `strategy` を順に適用します。`strategy` が `undefined` 以外を返すと、その値が次の結果になります。`undefined` を返した場合、値が配列なら各要素を順にマージし、それ以外の値は無視します（オブジェクトの中はたどりません）。他の関数はこの関数で作っています。

| 引数        | 型                     | 説明             |
| ----------- | ---------------------- | ---------------- |
| `valueList` | `readonly V[]`         | マージする値     |
| `strategy`  | `MergeStrategy<V, R>`  | マージ処理       |
| `options?`  | `MergeValueOptions<R>` | 下記のオプション |

| オプション      | 型             | 説明                                                                                                                        |
| --------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `initialValue?` | `R \| () => R` | 初期値。関数の場合は呼び出した結果を使う（結果が関数の場合は、関数を返す関数を渡す）。省略した場合は `undefined` から始める |

```ts
mergeValue(
  [1, [2, 3], null],
  (current, value) => (typeof value === 'number' ? current + value : undefined),
  { initialValue: 0 },
); // 6
```

### 型

| 型                        | 説明                                   |
| ------------------------- | -------------------------------------- |
| `ClassNameValue`          | `mergeClassName` に渡せる値            |
| `ClassNameArray`          | `ClassNameValue` の配列                |
| `ClassNameResult`         | `mergeClassName` の結果（`string`）    |
| `HandlerValue`            | `mergeHandler` に渡せる値              |
| `HandlerArray`            | `HandlerValue` の配列                  |
| `HandlerFn`               | ハンドラー                             |
| `HandlerResult`           | `mergeHandler` でまとめた関数          |
| `RefValue<T>`             | `mergeRef` に渡せる値                  |
| `RefArray<T>`             | `RefValue<T>` の配列                   |
| `RefResult<T>`            | `mergeRef` でまとめた ref callback     |
| `StyleValue`              | `mergeStyle` に渡せる値                |
| `StyleArray`              | `StyleValue` の配列                    |
| `StyleResult`             | `mergeStyle` の結果（`CSSProperties`） |
| `PropsValue<PROPS, REF>`  | `mergeProps` に渡せる値                |
| `PropsArray<PROPS, REF>`  | `PropsValue<PROPS, REF>` の配列        |
| `PropsResult<PROPS, REF>` | `mergeProps` の結果                    |
| `MergeStrategyItem<V, R>` | `mergeObject` のプロパティごとの処理   |
| `MergeCondition`          | `MergeStrategyItem` の `condition`     |
| `MergeObjectOptions<R>`   | `mergeObject` のオプション             |
| `MergeStrategy<V, R>`     | `mergeValue` のマージ処理              |
| `MergeValueOptions<R>`    | `mergeValue` のオプション              |
| `InitialValueFn<R>`       | 初期値を返す関数                       |
