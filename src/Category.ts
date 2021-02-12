/**
 * Discrete Common Sense Logic
 *
 * Discrete Common Sense Logic only allows `true`, `false`, `maybe`, `never` or `undefined` as a value.
 */

/**
 * Base Discrete Common Sense Logic type.
 *
 * To avoid conflict with Fuzzy values (numbers from `0.0` to `1.0`) we start numbering from `2`.
 */
export enum Category {
  /** Totally unknown */
  UNDEF = 2,
  /** Certainly negative */
  FALSE = 3,
  /** Impossible (neither positive nor negative) */
  NEVER = 4,
  /** Uncertain (could be either positive or negative) */
  MAYBE = 5,
  /** Certainly positive */
  TRUE = 6
}

/**
 * Discrete Logical Category of “totally unknown”
 */
export const UNDEF: Category = Category.UNDEF;
/**
 * Discrete Logical Category of “certainly negative”
 */
export const FALSE: Category = Category.FALSE;
/**
 * Discrete Logical Category of “impossible” (neither positive nor negative)
 */
export const NEVER: Category = Category.NEVER;
/**
 * Discrete Logical Category of “uncertain” (could be either positive or negative)
 */
export const MAYBE: Category = Category.MAYBE;
/**
 * Discrete Logical Category of “certainly positive”
 */
export const TRUE: Category = Category.TRUE;

/**
 * List of all five categories.
 *
 * Useful to iterate through all five logical categories.
 */
export const Categories = [UNDEF, FALSE, NEVER, MAYBE, TRUE];

/**
 * Discrete Logical NOT:
 *
 * | `undef` | `false` | `never` | `maybe` | `true` |
 * | --- | --- | --- | --- | --- |
 * | `undef` | `true` | `maybe` | `never` | `false` |
 */
export function not(value: Category): Category {
  switch (value) {
    case FALSE:
      return TRUE;
    case NEVER:
      return MAYBE;
    case MAYBE:
      return NEVER;
    case TRUE:
      return FALSE;
    default:
      return UNDEF;
  }
}

/**
 * Discrete Logical AND:
 *
 * | `a` \ `b` | `undef` | `false` | `never` | `maybe` | `true` |
 * | --- | --- | --- | --- | --- | --- |
 * | **`undef`** | `undef` | `undef` | `undef` | `undef` | `undef` |
 * | **`false`** | `undef` | `false` | `false` | `false` | `false` |
 * | **`never`** | `undef` | `false` | `never` | `false` | `never` |
 * | **`maybe`** | `undef` | `false` | `false` | `maybe` | `maybe` |
 * | **`true`** | `undef` | `false` | `never` | `maybe` | `true` |
 */
export function and(a: Category, b: Category): Category {
  if (a === UNDEF || b === UNDEF) return UNDEF;
  if (a === FALSE || b === FALSE) return FALSE;
  if (a === TRUE) return b;
  if (b === TRUE) return a;
  if (a === NEVER && b === NEVER) return NEVER;
  if (a === MAYBE && b === MAYBE) return MAYBE;
  return FALSE;
}

/**
 * Discrete Logical OR:
 *
 * | `a` \ `b` | `undef` | `false` | `never` | `maybe` | `true` |
 * | --- | --- | --- | --- | --- | --- |
 * | **`undef`** | `undef` | `undef` | `undef` | `undef` | `undef` |
 * | **`false`** | `undef` | `false` | `never` | `maybe` | `true` |
 * | **`never`** | `undef` | `never` | `never` | `true` | `true` |
 * | **`maybe`** | `undef` | `maybe` | `true` | `maybe` | `true` |
 * | **`true`** | `undef` | `true` | `true` | `true` | `true` |
 */
export function or(a: Category, b: Category): Category {
  if (a === UNDEF || b === UNDEF) return UNDEF;
  if (a === TRUE || b === TRUE) return TRUE;
  if (a === FALSE) return b;
  if (b === FALSE) return a;
  if (a === NEVER && b === NEVER) return NEVER;
  if (a === MAYBE && b === MAYBE) return MAYBE;
  return TRUE;
}
