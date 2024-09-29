export type ClassDefinition = new (...args: unknown[]) => unknown;

export type ClassConstructorReturnType<T> = T extends new (
  ...args: unknown[]
) => infer R
  ? R
  : unknown;

export function isClassDefinition(value: unknown): value is ClassDefinition {
  return typeof value === 'function';
}
