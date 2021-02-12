/**
 * Fuzzy Logic (based on Zadeh operators)
 *
 * Fuzzy logical value is a number between `0.0` (0% probability) and `1.0` (100% probability).
 */

/**
 * Base Fuzzy Logic type.
 *
 * Value must be between `0.0` (0% probability) and `1.0` (100% probability) inclusive.
 */
export type Fuzzy = number;

/**
 * Fuzzy logical value of `false` (zero probability)
 */
export const FUZZY_FALSE: Fuzzy = 0.0;
/**
 * Fuzzy logical value of `true` (100% probability)
 */
export const FUZZY_TRUE: Fuzzy = 1.0;

/**
 * Ensures the fuzzy value is between `0.0` and `1.0`.
 *
 * @return If `value` is less than `0.0`, returns `0.0`.
 * If `value` is greater then `1.0`, returns `1.0`. Otherwise returns `value`.
 *
 */
export function normalize(value: Fuzzy): Fuzzy {
  if (value >= FUZZY_TRUE) return FUZZY_TRUE;
  if (value <= FUZZY_FALSE) return FUZZY_FALSE;
  return value;
}

/**
 * Fuzzy Logical NOT
 * @return Result of subtraction of provided value from `1.0`.
 */
export function not(value: Fuzzy): Fuzzy {
  return normalize(FUZZY_TRUE - value);
}

/**
 * Fuzzy Logical AND
 *
 * @param values  Accepts an unlimited number of arguments
 * @return        Result of Fuzzy Logical AND (the minimum of all provided values, defaults to `FUZZY_TRUE`)
 */
export function and(...values: Fuzzy[]): Fuzzy {
  return normalize(Math.min(FUZZY_TRUE, ...values));
}

/**
 * Fuzzy Logical OR
 *
 * @param values  Accepts an unlimited number of arguments
 * @return        Result of Fuzzy Logical OR (the maximum of all provided values, defaults to `FUZZY_FALSE`)
 */
export function or(...values: Fuzzy[]): Fuzzy {
  return normalize(Math.max(FUZZY_FALSE, ...values));
}
