import {
  Category,
  Categories,
  not as dNot,
  and as dAnd,
  or as dOr,
  UNDEF,
  FALSE,
  NEVER,
  MAYBE,
  TRUE
} from './Category';
import {
  Fuzzy,
  not as fNot,
  and as fAnd,
  or as fOr,
  normalize as fNormalize,
  FUZZY_TRUE,
  FUZZY_FALSE
} from './Fuzzy';
import {
  Logic,
  LogicHash,
  LogicValues,
  not as lNot,
  and as lAnd,
  or as lOr,
  normalize as lNormalize
} from './Logic';

export function not(value: Fuzzy): Fuzzy;
export function not(value: Category): Category;
export function not(value: Logic): Logic;
export function not(value: Category | Fuzzy | Logic): Category | Fuzzy | Logic {
  if (typeof value === 'number') {
    if (Category[value]) return dNot(value);
    return fNot(value);
  }
  if (typeof value === 'object') {
    return lNot(value);
  }
  throw new TypeError('Invalid argument type');
}

export function and(a: Fuzzy, b: Fuzzy): Fuzzy;
export function and(a: Category, b: Category): Category;
export function and(a: Logic, b: Logic): Logic;
export function and(a: Category | Logic, b: Category | Logic): Category | Logic {
  if (typeof a === 'number' && typeof b === 'number') {
    if (Category[a] && Category[b]) return dAnd(a, b);
    return fAnd(a, b);
  }
  if (typeof a === 'object' && typeof b === 'object') {
    return lAnd(a, b);
  }
  throw new TypeError('Invalid argument type');
}

export function or(a: Fuzzy, b: Fuzzy): Fuzzy;
export function or(a: Category, b: Category): Category;
export function or(a: Logic, b: Logic): Logic;
export function or(a: Category | Logic, b: Category | Logic): Category | Logic {
  if (typeof a === 'number' && typeof b === 'number') {
    if (Category[a] && Category[b]) return dOr(a, b);
    return fOr(a, b);
  }
  if (typeof a === 'object' && typeof b === 'object') {
    return lOr(a, b);
  }
  throw new TypeError('Invalid argument type');
}

export function normalize(value: Fuzzy): Fuzzy;
export function normalize(value: Logic): Logic;
export function normalize(value: Fuzzy | Logic): Fuzzy | Logic {
  if (typeof value === 'number') return fNormalize(value);
  if (typeof value === 'object') return lNormalize(value);
  throw new TypeError('Invalid argument type');
}

export {
  // Categories
  Category,
  Categories,
  UNDEF,
  FALSE,
  NEVER,
  MAYBE,
  TRUE,
  // Fuzzy Logic
  Fuzzy,
  FUZZY_TRUE,
  FUZZY_FALSE,
  // Human Logic
  Logic,
  LogicHash,
  LogicValues
};
