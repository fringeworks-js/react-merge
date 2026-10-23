import mergeHandler from './mergeHandler';

describe('mergeHandler', () => {
  test('No items', () => {
    const result = mergeHandler();
    expect(result).toBeUndefined();
  });

  test('Flat', () => {
    let handlerResult1;
    let handlerResult2;
    let handlerResult3;
    const handler1 = (value: number) => (handlerResult1 = value);
    const handler2 = (value: number) => (handlerResult2 = value + 1);
    const handler3 = (value: number) => (handlerResult3 = value + 2);
    const result = mergeHandler([
      handler1,
      null,
      handler2,
      undefined,
      handler3,
    ]);

    result!(10);

    expect(handlerResult1).toBe(10);
    expect(handlerResult2).toBe(11);
    expect(handlerResult3).toBe(12);
  });

  test('Nested', () => {
    let handlerResult1;
    let handlerResult2;
    let handlerResult3;
    const handler1 = (value: number) => (handlerResult1 = value);
    const handler2 = (value: number) => (handlerResult2 = value + 1);
    const handler3 = (value: number) => (handlerResult3 = value + 2);
    const result = mergeHandler([
      handler1,
      null,
      handler2,
      [undefined, handler3],
    ]);

    result!(10);

    expect(handlerResult1).toBe(10);
    expect(handlerResult2).toBe(11);
    expect(handlerResult3).toBe(12);
  });

  test('Returns the value of the last handler', () => {
    const result = mergeHandler(
      () => 1,
      () => 2,
    );
    expect(result!()).toBe(2);
  });

  test('Single handler is returned as is', () => {
    const handler = () => {};
    expect(mergeHandler(null, handler, false)).toBe(handler);
  });

  test('Only empty values', () => {
    expect(mergeHandler(null, undefined, false, [true])).toBeUndefined();
  });
});
