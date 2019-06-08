import { Fuzzy, not as fNot, and as fAnd, or as fOr, FUZZY_FALSE, FUZZY_TRUE } from './Fuzzy';
import { Category } from './Category';

export interface LogicHash {
  _undef?: Fuzzy;
  _false?: Fuzzy;
  _never?: Fuzzy;
  _maybe?: Fuzzy;
  _true?: Fuzzy;
}

export interface LogicValues {
  [Category.UNDEF]: Fuzzy;
  [Category.FALSE]: Fuzzy;
  [Category.NEVER]: Fuzzy;
  [Category.MAYBE]: Fuzzy;
  [Category.TRUE]: Fuzzy;
}

export class Logic {
  private values: LogicValues;

  public constructor(_undef?: Fuzzy, _false?: Fuzzy, _never?: Fuzzy, _maybe?: Fuzzy, _true?: Fuzzy) {
    this.values = {
      [Category.UNDEF]: _undef || FUZZY_FALSE,
      [Category.FALSE]: _false || FUZZY_FALSE,
      [Category.NEVER]: _never || FUZZY_FALSE,
      [Category.MAYBE]: _maybe || FUZZY_FALSE,
      [Category.TRUE]: _true || FUZZY_FALSE
    };
  }

  public static fromCategory(category: Category): Logic {
    return new Logic(
      category === Category.UNDEF ? FUZZY_TRUE : FUZZY_FALSE,
      category === Category.FALSE ? FUZZY_TRUE : FUZZY_FALSE,
      category === Category.NEVER ? FUZZY_TRUE : FUZZY_FALSE,
      category === Category.MAYBE ? FUZZY_TRUE : FUZZY_FALSE,
      category === Category.TRUE ? FUZZY_TRUE : FUZZY_FALSE
    );
  }

  public static fromArray(fuzzy: Fuzzy[]): Logic {
    return new Logic(
      fuzzy[Category.UNDEF - Category.UNDEF],
      fuzzy[Category.FALSE - Category.UNDEF],
      fuzzy[Category.NEVER - Category.UNDEF],
      fuzzy[Category.MAYBE - Category.UNDEF],
      fuzzy[Category.TRUE - Category.UNDEF]
    );
  }

  public static fromHash(fuzzy: LogicHash): Logic {
    return new Logic(fuzzy._undef, fuzzy._false, fuzzy._never, fuzzy._maybe, fuzzy._true);
  }

  public asArray(): Fuzzy[] {
    return [
      this.values[Category.UNDEF],
      this.values[Category.FALSE],
      this.values[Category.NEVER],
      this.values[Category.MAYBE],
      this.values[Category.TRUE]
    ];
  }

  public asHash(): LogicHash {
    return {
      _undef: this.values[Category.UNDEF],
      _false: this.values[Category.FALSE],
      _never: this.values[Category.NEVER],
      _maybe: this.values[Category.MAYBE],
      _true: this.values[Category.TRUE]
    };
  }

  public asCategory(): Category | undefined {
    let result: Category = Category.UNDEF;
    if (this.values[result] < this.values[Category.FALSE]) result = Category.FALSE;
    if (this.values[result] < this.values[Category.NEVER]) result = Category.NEVER;
    if (this.values[result] < this.values[Category.MAYBE]) result = Category.MAYBE;
    if (this.values[result] < this.values[Category.TRUE]) result = Category.TRUE;
    return this.values[result] > FUZZY_FALSE ? result : undefined;
  }

  public asValues(): LogicValues {
    return { ...this.values };
  }

  protected getValues(): LogicValues {
    return this.values;
  }

  public clone(): Logic {
    return new Logic(
      this.values[Category.UNDEF],
      this.values[Category.FALSE],
      this.values[Category.NEVER],
      this.values[Category.MAYBE],
      this.values[Category.TRUE]
    );
  }

  public toString(): string {
    return `(${this.asArray()
      .map((val): string => val.toFixed(2))
      .join(',')})`;
  }

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

  public getNormalized(category: Category): Fuzzy {
    return this.values[category] / this.normalizer();
  }

  public normalize(): Logic {
    const normalizer = this.normalizer();
    return Math.abs(normalizer - FUZZY_TRUE) < 1e-8 ? this : this.multiply(FUZZY_TRUE / normalizer);
  }

  public isValid(): boolean {
    return this.scalar() > FUZZY_FALSE;
  }

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

  public eq(category: Category): boolean {
    return (
      (category === Category.UNDEF || this.values[category] > this.values[Category.UNDEF]) &&
      (category === Category.FALSE || this.values[category] > this.values[Category.FALSE]) &&
      (category === Category.NEVER || this.values[category] > this.values[Category.NEVER]) &&
      (category === Category.MAYBE || this.values[category] > this.values[Category.MAYBE]) &&
      (category === Category.TRUE || this.values[category] > this.values[Category.TRUE])
    );
  }

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

export function not(value: Logic): Logic {
  if (value && value instanceof Logic) return value.not();
  throw new TypeError('Invalid argument type');
}

export function and(a: Logic, b: Logic): Logic {
  if (a && a instanceof Logic) return a.and(b);
  throw new TypeError('Invalid argument type');
}

export function or(a: Logic, b: Logic): Logic {
  if (a && a instanceof Logic) return a.or(b);
  throw new TypeError('Invalid argument type');
}

export function normalize(value: Logic): Logic {
  if (value && value instanceof Logic) return value.normalize();
  throw new TypeError('Invalid argument type');
}
