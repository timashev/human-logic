/**
 * Fuzzy Common Sense Logic
 *
 * Human Logic (also known as “common sense”) is based on five categories:
 * - `true` = certainly positive
 * - `false` = certainly negative
 * - `maybe` = uncertain (could be either positive or negative)
 * - `never` = impossible (neither positive nor negative)
 * - `undefined` = totally unknown
 *
 * In Fuzzy Common Sense Logic the value is five-dimensional unit vector.
 * Each vector component is a fuzzy value (between 0.0 and 1.0 inclusive)
 * of respective `true`, `false`, `maybe`, `never` or `undefined` category.
 * @module
 */

/** @hidden */
import { Fuzzy, not as fNot, and as fAnd, or as fOr, FUZZY_FALSE, FUZZY_TRUE } from './Fuzzy';
/** @hidden */
import { Category, UNDEF, FALSE, NEVER, MAYBE, TRUE } from './Category';

/**
 * Object-like hash to provide and receive Fuzzy Common Sense logical values where {@link Category}
 * values are used as keys.
 */
export interface LogicValues {
  [UNDEF]: Fuzzy;
  [FALSE]: Fuzzy;
  [NEVER]: Fuzzy;
  [MAYBE]: Fuzzy;
  [TRUE]: Fuzzy;
}

/**
 * Main Fuzzy Common Sense Logic Class
 */
export class Logic {
  private values: LogicValues;

  /**
   * Basic constructor. See {@link fromCategory}, {@link fromArray} and {@link fromValues}
   * for more convenient instantiation methods.
   */
  public constructor(_undef?: Fuzzy, _false?: Fuzzy, _never?: Fuzzy, _maybe?: Fuzzy, _true?: Fuzzy) {
    this.values = {
      [UNDEF]: _undef || FUZZY_FALSE,
      [FALSE]: _false || FUZZY_FALSE,
      [NEVER]: _never || FUZZY_FALSE,
      [MAYBE]: _maybe || FUZZY_FALSE,
      [TRUE]: _true || FUZZY_FALSE
    };
  }

  /**
   * Creates new {@link Logic} instance with {@link Fuzzy.FUZZY_TRUE} value for the specified `category`
   * (and {@link Fuzzy.FUZZY_FALSE} for all other categories).
   */
  public static fromCategory(category: Category): Logic {
    return new Logic(
      category === UNDEF ? FUZZY_TRUE : FUZZY_FALSE,
      category === FALSE ? FUZZY_TRUE : FUZZY_FALSE,
      category === NEVER ? FUZZY_TRUE : FUZZY_FALSE,
      category === MAYBE ? FUZZY_TRUE : FUZZY_FALSE,
      category === TRUE ? FUZZY_TRUE : FUZZY_FALSE
    );
  }

  /**
   * Creates new {@link Logic} instance from array of {@link Fuzzy} values.
   * @param fuzzy The categories order in array is: {@link Category.UNDEF}, {@link Category.FALSE},
   * {@link Category.NEVER}, {@link Category.MAYBE}, {@link Category.TRUE}.
   */
  public static fromArray(fuzzy: Fuzzy[]): Logic {
    return new Logic(fuzzy[0], fuzzy[1], fuzzy[2], fuzzy[3], fuzzy[4]);
  }

  /**
   * Creates new {@link Logic} instance from {@link LogicValues}.
   */
  public static fromValues(fuzzy: LogicValues): Logic {
    return new Logic(fuzzy.UNDEF, fuzzy.FALSE, fuzzy.NEVER, fuzzy.MAYBE, fuzzy.TRUE);
  }

  /**
   * Retrieves an array of {@link Fuzzy} values.
   * @return The categories order in array is: {@link Category.UNDEF}, {@link Category.FALSE},
   * {@link Category.NEVER}, {@link Category.MAYBE}, {@link Category.TRUE}.
   */
  public asArray(): Fuzzy[] {
    return [
      this.values[UNDEF],
      this.values[FALSE],
      this.values[NEVER],
      this.values[MAYBE],
      this.values[TRUE]
    ];
  }

  /**
   * Dominating {@link Category} or `undefined` if none of the categories
   * has a value greater than {@link Fuzzy.FUZZY_FALSE}.
   */
  public asCategory(): Category | undefined {
    let result: Category = UNDEF;
    if (this.values[result] < this.values[FALSE]) result = FALSE;
    if (this.values[result] < this.values[NEVER]) result = NEVER;
    if (this.values[result] < this.values[MAYBE]) result = MAYBE;
    if (this.values[result] < this.values[TRUE]) result = TRUE;
    return this.values[result] > FUZZY_FALSE ? result : undefined;
  }

  /**
   * Retrieves a copy of {@link LogicValues}.
   * @return A clone, a new instance of {@link LogicValues} created from the values kept internally.
   */
  public asValues(): LogicValues {
    return { ...this.values };
  }

  protected getValues(): LogicValues {
    return this.values;
  }

  /**
   * Creates a deep copy (a clone) of a current instance.
   */
  public clone(): Logic {
    return new Logic(
      this.values[UNDEF],
      this.values[FALSE],
      this.values[NEVER],
      this.values[MAYBE],
      this.values[TRUE]
    );
  }

  /**
   * String representation of five-dimensional vector of {@link Fuzzy} values.
   * The categories order is: {@link Category.UNDEF}, {@link Category.FALSE}, {@link Category.NEVER},
   * {@link Category.MAYBE}, {@link Category.TRUE}.
   */
  public toString(): string {
    return `(${this.asArray()
      .map((val): string => val.toFixed(2))
      .join(',')})`;
  }

  /**
   * Returns {@link Fuzzy} value of the specified category of this {@link Logic} object.
   */
  public get(category: Category): Fuzzy {
    return this.values[category];
  }

  protected scalar(): number {
    return (
      this.values[UNDEF] + this.values[FALSE] + this.values[NEVER] + this.values[MAYBE] + this.values[TRUE]
    );
  }

  protected normalizer(): number {
    return this.scalar() || FUZZY_TRUE;
  }

  /**
   * Returns normalized {@link Fuzzy} value for the specified category. See {@link normalize} for details.
   */
  public getNormalized(category: Category): Fuzzy {
    return this.values[category] / this.normalizer();
  }

  /**
   * If original values are not normalized, returns new Logic object with normalized {@link Logic} value,
   * otherwise return the same object.
   *
   * The {@link Logic} value is normalized if and only if the sum of {@link Fuzzy} values of all categories
   * equals to `1.0` (or `0.0` if there are no categories with {@link Fuzzy} value greater than
   * {@link Fuzzy.FUZZY_FALSE}).
   */
  public normalize(): Logic {
    const normalizer = this.normalizer();
    return Math.abs(normalizer - FUZZY_TRUE) < 1e-8 ? this : this.multiply(FUZZY_TRUE / normalizer);
  }

  /**
   * Checks that at least one of the categories has non-zero {@link Fuzzy} value.
   */
  public isValid(): boolean {
    return this.scalar() > FUZZY_FALSE;
  }

  /**
   * Fuzzy Common Sense Logical NOT. See [README](../index.html#fuzzy-common-sense-logic) for details.
   */
  public not(): Logic {
    return new Logic(
      // UNDEF:
      this.values[UNDEF],
      // FALSE:
      this.values[TRUE],
      // NEVER:
      this.values[MAYBE],
      // MAYBE:
      this.values[NEVER],
      // TRUE:
      this.values[FALSE]
    );
  }

  /**
   * Fuzzy Common Sense Logical AND. See [README](../index.html#fuzzy-common-sense-logic) for details.
   */
  public and(value: Logic): Logic {
    if (!value || !(value instanceof Logic)) throw new TypeError('Invalid argument type');
    const values = value.getValues();
    const undef = fOr(this.values[UNDEF], values[UNDEF]);
    const notUndef: Fuzzy = fNot(undef);
    return new Logic(
      // UNDEF:
      undef,
      // FALSE:
      fAnd(
        notUndef,
        fOr(
          this.values[FALSE],
          values[FALSE],
          fAnd(this.values[MAYBE], values[NEVER]),
          fAnd(this.values[NEVER], values[MAYBE])
        )
      ),
      // NEVER:
      fAnd(
        notUndef,
        fOr(
          fAnd(this.values[NEVER], values[NEVER]),
          fAnd(this.values[NEVER], values[TRUE]),
          fAnd(this.values[TRUE], values[NEVER])
        )
      ),
      // MAYBE:
      fAnd(
        notUndef,
        fOr(
          fAnd(this.values[MAYBE], values[MAYBE]),
          fAnd(this.values[MAYBE], values[TRUE]),
          fAnd(this.values[TRUE], values[MAYBE])
        )
      ),
      // TRUE:
      fAnd(notUndef, this.values[TRUE], values[TRUE])
    ).normalize();
  }

  /**
   * Fuzzy Common Sense Logical OR. See [README](../index.html#fuzzy-common-sense-logic) for details.
   */
  public or(value: Logic): Logic {
    if (!value || !(value instanceof Logic)) throw new TypeError('Invalid argument type');
    const values = value.getValues();
    const undef = fOr(this.values[UNDEF], values[UNDEF]);
    const notUndef: Fuzzy = fNot(undef);
    return new Logic(
      // UNDEF:
      undef,
      // FALSE:
      fAnd(notUndef, this.values[FALSE], values[FALSE]),
      // NEVER:
      fAnd(
        notUndef,
        fOr(
          fAnd(this.values[NEVER], values[NEVER]),
          fAnd(this.values[NEVER], values[FALSE]),
          fAnd(this.values[FALSE], values[NEVER])
        )
      ),
      // MAYBE:
      fAnd(
        notUndef,
        fOr(
          fAnd(this.values[MAYBE], values[MAYBE]),
          fAnd(this.values[MAYBE], values[FALSE]),
          fAnd(this.values[FALSE], values[MAYBE])
        )
      ),
      // TRUE:
      fAnd(
        notUndef,
        fOr(
          this.values[TRUE],
          values[TRUE],
          fAnd(this.values[MAYBE], values[NEVER]),
          fAnd(this.values[NEVER], values[MAYBE])
        )
      )
    ).normalize();
  }

  /**
   * Adds `value` to current value (category by category).
   * Useful for accumulation of fuzzy sums (usually with normalization in the end).
   * Mutates the current object.
   * @return Mutated `this` object.
   */
  public add(value: Logic): Logic {
    if (!value || !(value instanceof Logic)) throw new TypeError('Invalid argument type');
    const values = value.getValues();
    this.values[UNDEF] += values[UNDEF];
    this.values[FALSE] += values[FALSE];
    this.values[NEVER] += values[NEVER];
    this.values[MAYBE] += values[MAYBE];
    this.values[TRUE] += values[TRUE];
    return this;
  }

  protected multiply(value: number): Logic {
    return new Logic(
      // UNDEF:
      this.values[UNDEF] * value,
      // FALSE:
      this.values[FALSE] * value,
      // NEVER:
      this.values[NEVER] * value,
      // MAYBE:
      this.values[MAYBE] * value,
      // TRUE:
      this.values[TRUE] * value
    );
  }

  /**
   * Returns `true` if `category` is the dominating category of this object.
   */
  public eq(category: Category): boolean {
    return (
      (category === UNDEF || this.values[category] > this.values[UNDEF]) &&
      (category === FALSE || this.values[category] > this.values[FALSE]) &&
      (category === NEVER || this.values[category] > this.values[NEVER]) &&
      (category === MAYBE || this.values[category] > this.values[MAYBE]) &&
      (category === TRUE || this.values[category] > this.values[TRUE])
    );
  }

  /**
   * Returns `true` if `category` is **not** the dominating category of this object.
   */
  public ne(category: Category): boolean {
    return (
      (category !== UNDEF && this.values[category] <= this.values[UNDEF]) ||
      (category !== FALSE && this.values[category] <= this.values[FALSE]) ||
      (category !== NEVER && this.values[category] <= this.values[NEVER]) ||
      (category !== MAYBE && this.values[category] <= this.values[MAYBE]) ||
      (category !== TRUE && this.values[category] <= this.values[TRUE])
    );
  }
}

/**
 * Fuzzy Common Sense NOT (global function).
 * Allows to use different code styles, e.g.:
 * ```JavaScript
 * const valueA = value.not();
 * const valueB = not(value);
 * ```
 * See [README](../index.html#fuzzy-common-sense-logic) for details.
 */
export function not(value: Logic): Logic {
  if (value && value instanceof Logic) return value.not();
  throw new TypeError('Invalid argument type');
}

/**
 * Fuzzy Common Sense AND (global function).
 * Allows to use different code styles, e.g.:
 * ```JavaScript
 * const valueA = value1.and(value2);
 * const valueB = and(value1, value2);
 * ```
 * See [README](../index.html#fuzzy-common-sense-logic) for details.
 */
export function and(a: Logic, b: Logic): Logic {
  if (a && a instanceof Logic) return a.and(b);
  throw new TypeError('Invalid argument type');
}

/**
 * Fuzzy Common Sense OR (global function).
 * Allows to use different code styles, e.g.:
 * ```JavaScript
 * const valueA = value1.or(value2);
 * const valueB = or(value1, value2);
 * ```
 * See [README](../index.html#fuzzy-common-sense-logic) for details.
 */
export function or(a: Logic, b: Logic): Logic {
  if (a && a instanceof Logic) return a.or(b);
  throw new TypeError('Invalid argument type');
}

/**
 * Fuzzy Common Sense logical value normalization (global function).
 * Allows to use different code styles, e.g.:
 * ```JavaScript
 * const valueA = value.normalize();
 * const valueB = normalize(value);
 * ```
 * See {@link Logic.normalize} for details.
 */
export function normalize(value: Logic): Logic {
  if (value && value instanceof Logic) return value.normalize();
  throw new TypeError('Invalid argument type');
}
