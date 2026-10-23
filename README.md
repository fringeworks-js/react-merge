# @fringeworks/react-merge

`@fringeworks/react-merge` is a library some will find handy, for merging React properties such as `className`, `style`, `ref` and event handlers.

**[日本語のREADMEはこちら](./README.ja.md)**

## Installation

```bash
npm install @fringeworks/react-merge
# or
pnpm add @fringeworks/react-merge
```

## Usage

Functions and types can be imported under the same names from both the root and the per-function paths. A per-function path also provides the function as its default export.

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
  // className is joined, style is overridden, ref and handlers reach every source
  return <button {...merged} />;
}
```

### Merge rules

Every function merges the given values in order, from first to last.

- Arrays are merged element by element with the same rules (they may be nested)
- `null`, `undefined`, `true` and `false` do nothing, so conditional values can be passed as `cond && value`
- Functions (for `className`, `style` and whole props) are called with the result so far, and their return value replaces the result. Use them to remove values or to decide based on the result so far

```ts
mergeClassName('a', ['b', isActive && 'active']); // 'a b active' or 'a b'
mergeStyle({ color: 'red', margin: 0 }, ({ margin, ...rest }) => rest); // { color: 'red' }
```

### Recreated refs

`mergeRef` and `mergeProps` create a new ref callback on every call. When called during render, React detaches and reattaches the ref on every render (callback refs are called with `null` and the element each time).

To avoid this, combine the refs with `useCombinedRefs` from [`@fringeworks/react-utils`](https://www.npmjs.com/package/@fringeworks/react-utils), which returns the same ref callback across renders. Pass `mergeProps` the props without the ref, together with the combined ref. A single callback ref goes into the result as is, so the ref callback is not recreated.

```tsx
const { ref, ...rest } = props;
const combinedRef = useCombinedRefs(localRef, ref);
const merged = mergeProps<Props, HTMLDivElement>(defaults, rest, {
  ref: combinedRef,
});
```

---

## API

| Function                                        | Description                                                    |
| ----------------------------------------------- | -------------------------------------------------------------- |
| `mergeClassName(...classNameList)`              | Joins class names                                              |
| `mergeHandler(...handlerList)`                  | Combines handlers into one function that calls them in order   |
| `mergeObject(objectList, strategies, options?)` | Merges objects property by property with the matching strategy |
| `mergeProps(...propsList)`                      | Merges React properties                                        |
| `mergeRef(...refList)`                          | Combines refs into one ref callback that sets all of them      |
| `mergeStyle(...styleList)`                      | Merges style objects                                           |
| `mergeValue(valueList, strategy, options?)`     | A generic function that merges values in order                 |

### `mergeClassName`

```ts
mergeClassName(...classNameList: ClassNameValue[]): string
```

Joins class names with spaces. Returns `''` when there are no values.

```ts
mergeClassName('a', null, ['b', false && 'c']); // 'a b'
mergeClassName('a b', (current) => current.replace('a', '')); // ' b'
```

### `mergeHandler`

```ts
mergeHandler(...handlerList: HandlerValue[]): HandlerResult | undefined
```

Combines handlers into one function that calls them in the given order. The combined function returns the return value of the last handler. When there is only one handler, it is returned as is; when there are none, `undefined` is returned.

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

Merges objects property by property, using the first item in `strategies` whose condition matches. `mergeProps` is built on this function. The result is copied before being written to, so the given objects are not modified.

| Parameter    | Type                           | Description                                            |
| ------------ | ------------------------------ | ------------------------------------------------------ |
| `objectList` | `readonly O[]`                 | Values to merge                                        |
| `strategies` | `readonly MergeStrategyItem[]` | Strategies per property. Earlier items take precedence |
| `options?`   | `MergeObjectOptions<R>`        | Options below                                          |

| Option              | Type           | Description                                                         |
| ------------------- | -------------- | ------------------------------------------------------------------- |
| `initialValue?`     | `R \| () => R` | Initial value. Defaults to `{}`                                     |
| `excludeUnmatched?` | `boolean`      | Leaves out properties that no strategy matched. Defaults to `false` |

The properties of `MergeStrategyItem` are as follows.

| Property        | Type                                                         | Description                                                                                                                                              |
| --------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition?`    | `MergeCondition`                                             | Which properties to handle: a string matches the key exactly, a RegExp is tested against the key, a function returns `true`. All properties when omitted |
| `initialValue?` | `R \| () => R`                                               | Value used while the property of the result is still `undefined`                                                                                         |
| `strategy`      | `(currentValue: R, value: V, key: string) => R \| undefined` | Merge strategy. Returning `undefined` leaves the property unchanged                                                                                      |

### `mergeProps`

```ts
mergeProps<PROPS, REF>(...propsList: PropsValue<PROPS, REF>[]): PropsResult<PROPS, REF>
```

Merges React properties. `PROPS` is the type of the properties, and `REF` is the type of the value received by `ref`. Each item may contain only part of `PROPS` (whether the required properties are all present is not checked).

| Property                                          | How it is merged                                                     |
| ------------------------------------------------- | -------------------------------------------------------------------- |
| `className`                                       | Same as `mergeClassName`                                             |
| `style`                                           | Same as `mergeStyle`                                                 |
| `ref`                                             | Same as `mergeRef`                                                   |
| Starts with `on` + uppercase, value is a function | Same as `mergeHandler`                                               |
| Others                                            | Overridden by later values. `undefined` is ignored, `null` overrides |

For the four kinds of properties above, `null`, `undefined`, `true` and `false` are ignored. To remove a value, pass a function that replaces the result.

```ts
mergeProps<Props, HTMLDivElement>(props, ({ onClick, ...rest }) => rest);
```

### `mergeRef`

```ts
mergeRef<T>(...refList: RefValue<T>[]): RefCallback<T> | undefined
```

Combines refs (ref objects and callback refs) into one ref callback that sets all of them. When there is only one callback ref, it is returned as is; when there are no refs, `undefined` is returned.

The combined ref callback returns a cleanup function (React 19). The cleanup resets `current` of ref objects to `null` and calls the cleanup functions returned by callback refs. Callback refs that return no cleanup function are called with `null`. In React 18, the combined ref callback receives `null` when the element is detached, and `null` is set to all refs.

### `mergeStyle`

```ts
mergeStyle(...styleList: StyleValue[]): CSSProperties
```

Merges style objects. Later values take precedence, and properties whose value is `undefined` do not override. Returns `{}` when there are no values. The given objects are not modified.

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

Starting from the initial value, applies `strategy` to each value in order. When `strategy` returns anything other than `undefined`, that becomes the next result. When it returns `undefined`, an array value is merged element by element and any other value is ignored (objects are not traversed). The other functions are built on this function.

| Parameter   | Type                   | Description     |
| ----------- | ---------------------- | --------------- |
| `valueList` | `readonly V[]`         | Values to merge |
| `strategy`  | `MergeStrategy<V, R>`  | Merge strategy  |
| `options?`  | `MergeValueOptions<R>` | Options below   |

| Option          | Type           | Description                                                                                                                                                  |
| --------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `initialValue?` | `R \| () => R` | Initial value. A function is called and its result is used (to start from a function, pass a function that returns it). Starts from `undefined` when omitted |

```ts
mergeValue(
  [1, [2, 3], null],
  (current, value) => (typeof value === 'number' ? current + value : undefined),
  { initialValue: 0 },
); // 6
```

### Types

| Type                      | Description                              |
| ------------------------- | ---------------------------------------- |
| `ClassNameValue`          | Values accepted by `mergeClassName`      |
| `ClassNameArray`          | Array of `ClassNameValue`                |
| `ClassNameResult`         | Result of `mergeClassName` (`string`)    |
| `HandlerValue`            | Values accepted by `mergeHandler`        |
| `HandlerArray`            | Array of `HandlerValue`                  |
| `HandlerFn`               | Handler                                  |
| `HandlerResult`           | Function combined by `mergeHandler`      |
| `RefValue<T>`             | Values accepted by `mergeRef`            |
| `RefArray<T>`             | Array of `RefValue<T>`                   |
| `RefResult<T>`            | Ref callback combined by `mergeRef`      |
| `StyleValue`              | Values accepted by `mergeStyle`          |
| `StyleArray`              | Array of `StyleValue`                    |
| `StyleResult`             | Result of `mergeStyle` (`CSSProperties`) |
| `PropsValue<PROPS, REF>`  | Values accepted by `mergeProps`          |
| `PropsArray<PROPS, REF>`  | Array of `PropsValue<PROPS, REF>`        |
| `PropsResult<PROPS, REF>` | Result of `mergeProps`                   |
| `MergeStrategyItem<V, R>` | Per-property strategy of `mergeObject`   |
| `MergeCondition`          | `condition` of `MergeStrategyItem`       |
| `MergeObjectOptions<R>`   | Options of `mergeObject`                 |
| `MergeStrategy<V, R>`     | Merge strategy of `mergeValue`           |
| `MergeValueOptions<R>`    | Options of `mergeValue`                  |
| `InitialValueFn<R>`       | Function that returns the initial value  |
