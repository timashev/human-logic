export type Fuzzy = number;

export const FUZZY_FALSE: Fuzzy = 0.0;
export const FUZZY_TRUE: Fuzzy = 1.0;

export function normalize(value: Fuzzy): Fuzzy {
  if (value >= FUZZY_TRUE) return FUZZY_TRUE;
  if (value <= FUZZY_FALSE) return FUZZY_FALSE;
  return value;
}

export function not(value: Fuzzy): Fuzzy {
  return normalize(FUZZY_TRUE - value);
}

export function and(...values: Fuzzy[]): Fuzzy {
  return normalize(Math.min(FUZZY_TRUE, ...values));
}

export function or(...values: Fuzzy[]): Fuzzy {
  return normalize(Math.max(FUZZY_FALSE, ...values));
}
