/**
 * Discrete Common Sense Logic
 *
 * Discrete Common Sense Logic only allows `true`, `false`, `maybe`, `never` or `undefined` as a value.
 * @module
 */

/**
 * Discrete Logical Category of “totally unknown”
 */
export const UNDEF = 'UNDEF' as const;
/**
 * Discrete Logical Category of “certainly negative”
 */
export const FALSE = 'FALSE' as const;
/**
 * Discrete Logical Category of “impossible” (neither positive nor negative)
 */
export const NEVER = 'NEVER' as const;
/**
 * Discrete Logical Category of “uncertain” (could be either positive or negative)
 */
export const MAYBE = 'MAYBE' as const;
/**
 * Discrete Logical Category of “certainly positive”
 */
export const TRUE = 'TRUE' as const;

/**
 * List of all five categories.
 *
 * Useful to iterate through all five logical categories.
 */
export const Categories = [UNDEF, FALSE, NEVER, MAYBE, TRUE] as const;

/**
 * Base Discrete Common Sense Logic type.
 *
 * * `UNDEF` – Totally unknown
 * * `FALSE` – Certainly negative
 * * `NEVER` – Impossible (neither positive nor negative)
 * * `MAYBE` – Uncertain (could be either positive or negative)
 * * `TRUE` – Certainly positive
 */
export type Category = typeof Categories[number];

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
