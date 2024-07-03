export type UnwrapArray<A> = A extends unknown[] ? UnwrapArray<A[number]> : A;

export type AwaitedReturnType<T extends (...args: any) => any> = Awaited<
  ReturnType<T>
>;
