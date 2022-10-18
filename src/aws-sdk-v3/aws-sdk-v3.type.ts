export type ClassDefinition = new (...args: any[]) => any;

export type ClassConstructorReturnType<T> = T extends new (
  ...args: any[]
) => infer R
  ? R
  : any;
