// Discrete Common Sense Logic

export enum Category {
  UNDEF = 2, // to avoid conflic with Fuzzy values (numbers from 0.0 to 1.0)
  FALSE = 3,
  NEVER = 4,
  MAYBE = 5,
  TRUE = 6
}

export const UNDEF: Category = Category.UNDEF;
export const FALSE: Category = Category.FALSE;
export const NEVER: Category = Category.NEVER;
export const MAYBE: Category = Category.MAYBE;
export const TRUE: Category = Category.TRUE;

export const Categories = [UNDEF, FALSE, NEVER, MAYBE, TRUE];

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

export function and(a: Category, b: Category): Category {
  if (a === UNDEF || b === UNDEF) return UNDEF;
  if (a === FALSE || b === FALSE) return FALSE;
  if (a === TRUE) return b;
  if (b === TRUE) return a;
  if (a === NEVER && b === NEVER) return NEVER;
  if (a === MAYBE && b === MAYBE) return MAYBE;
  return FALSE;
}

export function or(a: Category, b: Category): Category {
  if (a === UNDEF || b === UNDEF) return UNDEF;
  if (a === TRUE || b === TRUE) return TRUE;
  if (a === FALSE) return b;
  if (b === FALSE) return a;
  if (a === NEVER && b === NEVER) return NEVER;
  if (a === MAYBE && b === MAYBE) return MAYBE;
  return TRUE;
}
