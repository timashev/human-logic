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
 */

/** @hidden */
import { Fuzzy, not as fNot, and as fAnd, or as fOr, FUZZY_FALSE, FUZZY_TRUE } from './Fuzzy';
/** @hidden */
import { Category } from './Category';

/**
 * Convenient object-like hash to provide and receive Fuzzy Common Sense logical values.
 */
export interface LogicHash {
  _undef?: Fuzzy;
  _false?: Fuzzy;
  _never?: Fuzzy;
  _maybe?: Fuzzy;
  _true?: Fuzzy;
}

/**
 * Object-like hash to provide and receive Fuzzy Common Sense logical values where [[Category]]
 * values are used as keys.
 */
export interface LogicValues {
  [Category.UNDEF]: Fuzzy;
  [Category.FALSE]: Fuzzy;
  [Category.NEVER]: Fuzzy;
  [Category.MAYBE]: Fuzzy;
  [Category.TRUE]: Fuzzy;
}

/**
 * Main Fuzzy Common Sense Logic Class
 */
export class Logic {
  private values: LogicValues;

  /**
   * Basic constructor. See [[fromCategory]], [[fromArray]] and [[fromHash]]
   * for more convenient instantiation methods.
   */
  public constructor(_undef?: Fuzzy, _false?: Fuzzy, _never?: Fuzzy, _maybe?: Fuzzy, _true?: Fuzzy) {
    this.values = {
      [Category.UNDEF]: _undef || FUZZY_FALSE,
      [Category.FALSE]: _false || FUZZY_FALSE,
      [Category.NEVER]: _never || FUZZY_FALSE,
      [Category.MAYBE]: _maybe || FUZZY_FALSE,
      [Category.TRUE]: _true || FUZZY_FALSE
    };
  }

  /**
   * Creates new [[Logic]] instance with [[FUZZY_TRUE]] value for the specified `category`
   * (and [[FUZZY_FALSE]] for all other categories).
   */
  public static fromCategory(category: Category): Logic {
    return new Logic(
      category === Category.UNDEF ? FUZZY_TRUE : FUZZY_FALSE,
      category === Category.FALSE ? FUZZY_TRUE : FUZZY_FALSE,
      category === Category.NEVER ? FUZZY_TRUE : FUZZY_FALSE,
      category === Category.MAYBE ? FUZZY_TRUE : FUZZY_FALSE,
      category === Category.TRUE ? FUZZY_TRUE : FUZZY_FALSE
    );
  }

  /**
   * Creates new [[Logic]] instance from array of [[Fuzzy]] values.
   * @param fuzzy The categories order in array is: [[UNDEF]], [[FALSE]], [[NEVER]], [[MAYBE]], [[TRUE]].
   */
  public static fromArray(fuzzy: Fuzzy[]): Logic {
    return new Logic(
      fuzzy[Category.UNDEF - Category.UNDEF],
      fuzzy[Category.FALSE - Category.UNDEF],
      fuzzy[Category.NEVER - Category.UNDEF],
      fuzzy[Category.MAYBE - Category.UNDEF],
      fuzzy[Category.TRUE - Category.UNDEF]
    );
  }

  /**
   * Creates new [[Logic]] instance from [[LogicHash]].
   */
  public static fromHash(fuzzy: LogicHash): Logic {
    return new Logic(fuzzy._undef, fuzzy._false, fuzzy._never, fuzzy._maybe, fuzzy._true);
  }

  /**
   * Retrieves an array of [[Fuzzy]] values.
   * @return The categories order in array is: [[UNDEF]], [[FALSE]], [[NEVER]], [[MAYBE]], [[TRUE]].
   */
  public asArray(): Fuzzy[] {
    return [
      this.values[Category.UNDEF],
      this.values[Category.FALSE],
      this.values[Category.NEVER],
      this.values[Category.MAYBE],
      this.values[Category.TRUE]
    ];
  }

  /**
   * Retrieves [[LogicHash]].
   */
  public asHash(): LogicHash {
    return {
      _undef: this.values[Category.UNDEF],
      _false: this.values[Category.FALSE],
      _never: this.values[Category.NEVER],
      _maybe: this.values[Category.MAYBE],
      _true: this.values[Category.TRUE]
    };
  }

  /**
   * Dominating [[Category]] or `undefined` if none of the categories
   * has a value greater than [[FUZZY_FALSE]].
   */
  public asCategory(): Category | undefined {
    let result: Category = Category.UNDEF;
    if (this.values[result] < this.values[Category.FALSE]) result = Category.FALSE;
    if (this.values[result] < this.values[Category.NEVER]) result = Category.NEVER;
    if (this.values[result] < this.values[Category.MAYBE]) result = Category.MAYBE;
    if (this.values[result] < this.values[Category.TRUE]) result = Category.TRUE;
    return this.values[result] > FUZZY_FALSE ? result : undefined;
  }

  /**
   * Retrieves a copy of [[LogicValues]].
   * @return A clone, a new instance of [[LogicValues]] created from the values kept internally.
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
      this.values[Category.UNDEF],
      this.values[Category.FALSE],
      this.values[Category.NEVER],
      this.values[Category.MAYBE],
      this.values[Category.TRUE]
    );
  }

  /**
   * String representation of five-dimensional vector of [[Fuzzy]] values.
   * The categories order is: [[UNDEF]], [[FALSE]], [[NEVER]], [[MAYBE]], [[TRUE]].
   */
  public toString(): string {
    return `(${this.asArray()
      .map((val): string => val.toFixed(2))
      .join(',')})`;
  }

  /**
   * Returns [[Fuzzy]] value of the specified category of this [[Logic]] object.
   */
  public get(category: Category): Fuzzy {
    return this.values[category];
  }

  protected scalar(): number {
    return (
      this.values[Category.UNDEF] +
      this.values[Category.FALSE] +
      this.values[Category.NEVER] +
      this.values[Category.MAYBE] +
      this.values[Category.TRUE]
    );
  }

  protected normalizer(): number {
    return this.scalar() || FUZZY_TRUE;
  }

  /**
   * Returns normalized [[Fuzzy]] value for the specified category. See [[normalize]] for details.
   */
  public getNormalized(category: Category): Fuzzy {
    return this.values[category] / this.normalizer();
  }

  /**
   * If original values are not normalized, returns new Logic object with normalized [[Logic]] value,
   * otherwise return the same object.
   *
   * The [[Logic]] value is normalized if and only if the sum of [[Fuzzy]] values of all categories
   * equals to `1.0` (or `0.0` if there are no categories with [[Fuzzy]] value greater than [[FUZZY_FALSE]]).
   */
  public normalize(): Logic {
    const normalizer = this.normalizer();
    return Math.abs(normalizer - FUZZY_TRUE) < 1e-8 ? this : this.multiply(FUZZY_TRUE / normalizer);
  }

  /**
   * Checks that at least one of the categories has non-zero [[Fuzzy]] value.
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
      this.values[Category.UNDEF],
      // FALSE:
      this.values[Category.TRUE],
      // NEVER:
      this.values[Category.MAYBE],
      // MAYBE:
      this.values[Category.NEVER],
      // TRUE:
      this.values[Category.FALSE]
    );
  }

  /**
   * Fuzzy Common Sense Logical AND. See [README](../index.html#fuzzy-common-sense-logic) for details.
   */
  public and(value: Logic): Logic {
    if (!value || !(value instanceof Logic)) throw new TypeError('Invalid argument type');
    const values = value.getValues();
    const undef = fOr(this.values[Category.UNDEF], values[Category.UNDEF]);
    const notUndef: Fuzzy = fNot(undef);
    return new Logic(
      // UNDEF:
      undef,
      // FALSE:
      fAnd(
        notUndef,
        fOr(
          this.values[Category.FALSE],
          values[Category.FALSE],
          fAnd(this.values[Category.MAYBE], values[Category.NEVER]),
          fAnd(this.values[Category.NEVER], values[Category.MAYBE])
        )
      ),
      // NEVER:
      fAnd(
        notUndef,
        fOr(
          fAnd(this.values[Category.NEVER], values[Category.NEVER]),
          fAnd(this.values[Category.NEVER], values[Category.TRUE]),
          fAnd(this.values[Category.TRUE], values[Category.NEVER])
        )
      ),
      // MAYBE:
      fAnd(
        notUndef,
        fOr(
          fAnd(this.values[Category.MAYBE], values[Category.MAYBE]),
          fAnd(this.values[Category.MAYBE], values[Category.TRUE]),
          fAnd(this.values[Category.TRUE], values[Category.MAYBE])
        )
      ),
      // TRUE:
      fAnd(notUndef, this.values[Category.TRUE], values[Category.TRUE])
    ).normalize();
  }

  /**
   * Fuzzy Common Sense Logical OR. See [README](../index.html#fuzzy-common-sense-logic) for details.
   */
  public or(value: Logic): Logic {
    if (!value || !(value instanceof Logic)) throw new TypeError('Invalid argument type');
    const values = value.getValues();
    const undef = fOr(this.values[Category.UNDEF], values[Category.UNDEF]);
    const notUndef: Fuzzy = fNot(undef);
    return new Logic(
      // UNDEF:
      undef,
      // FALSE:
      fAnd(notUndef, this.values[Category.FALSE], values[Category.FALSE]),
      // NEVER:
      fAnd(
        notUndef,
        fOr(
          fAnd(this.values[Category.NEVER], values[Category.NEVER]),
          fAnd(this.values[Category.NEVER], values[Category.FALSE]),
          fAnd(this.values[Category.FALSE], values[Category.NEVER])
        )
      ),
      // MAYBE:
      fAnd(
        notUndef,
        fOr(
          fAnd(this.values[Category.MAYBE], values[Category.MAYBE]),
          fAnd(this.values[Category.MAYBE], values[Category.FALSE]),
          fAnd(this.values[Category.FALSE], values[Category.MAYBE])
        )
      ),
      // TRUE:
      fAnd(
        notUndef,
        fOr(
          this.values[Category.TRUE],
          values[Category.TRUE],
          fAnd(this.values[Category.MAYBE], values[Category.NEVER]),
          fAnd(this.values[Category.NEVER], values[Category.MAYBE])
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
    this.values[Category.UNDEF] += values[Category.UNDEF];
    this.values[Category.FALSE] += values[Category.FALSE];
    this.values[Category.NEVER] += values[Category.NEVER];
    this.values[Category.MAYBE] += values[Category.MAYBE];
    this.values[Category.TRUE] += values[Category.TRUE];
    return this;
  }

  protected multiply(value: number): Logic {
    return new Logic(
      // UNDEF:
      this.values[Category.UNDEF] * value,
      // FALSE:
      this.values[Category.FALSE] * value,
      // NEVER:
      this.values[Category.NEVER] * value,
      // MAYBE:
      this.values[Category.MAYBE] * value,
      // TRUE:
      this.values[Category.TRUE] * value
    );
  }

  /**
   * Returns `true` if `category` is the dominating category of this object.
   */
  public eq(category: Category): boolean {
    return (
      (category === Category.UNDEF || this.values[category] > this.values[Category.UNDEF]) &&
      (category === Category.FALSE || this.values[category] > this.values[Category.FALSE]) &&
      (category === Category.NEVER || this.values[category] > this.values[Category.NEVER]) &&
      (category === Category.MAYBE || this.values[category] > this.values[Category.MAYBE]) &&
      (category === Category.TRUE || this.values[category] > this.values[Category.TRUE])
    );
  }

  /**
   * Returns `true` if `category` is **not** the dominating category of this object.
   */
  public ne(category: Category): boolean {
    return (
      (category !== Category.UNDEF && this.values[category] <= this.values[Category.UNDEF]) ||
      (category !== Category.FALSE && this.values[category] <= this.values[Category.FALSE]) ||
      (category !== Category.NEVER && this.values[category] <= this.values[Category.NEVER]) ||
      (category !== Category.MAYBE && this.values[category] <= this.values[Category.MAYBE]) ||
      (category !== Category.TRUE && this.values[category] <= this.values[Category.TRUE])
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
 * See [[Logic.normalize]] for details.
 */
export function normalize(value: Logic): Logic {
  if (value && value instanceof Logic) return value.normalize();
  throw new TypeError('Invalid argument type');
}
