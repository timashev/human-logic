import { Categories, not, and, or, UNDEF, FALSE, NEVER, MAYBE, TRUE } from './Category';

describe('Categorical NOT', (): void => {
  test('!UNDEF', (): void => {
    expect(not(UNDEF)).toBe(UNDEF);
  });
  test('!FALSE', (): void => {
    expect(not(FALSE)).toBe(TRUE);
  });
  test('!NEVER', (): void => {
    expect(not(NEVER)).toBe(MAYBE);
  });
  test('!MAYBE', (): void => {
    expect(not(MAYBE)).toBe(NEVER);
  });
  test('!TRUE', (): void => {
    expect(not(TRUE)).toBe(FALSE);
  });
});

describe('Categorical AND', (): void => {
  Categories.forEach((value): void =>
    test(`UNDEF && ${value}`, (): void => {
      expect(and(UNDEF, value)).toBe(UNDEF);
    })
  );
  Categories.forEach((value): void =>
    test(`FALSE && ${value}`, (): void => {
      expect(and(FALSE, value)).toBe(value === UNDEF ? UNDEF : FALSE);
    })
  );
  Categories.forEach((value): void =>
    test(`NEVER && ${value}`, (): void => {
      expect(and(NEVER, value)).toBe(
        ((value === FALSE || value === MAYBE) && FALSE) || (value === UNDEF ? UNDEF : NEVER)
      );
    })
  );
  Categories.forEach((value): void =>
    test(`MAYBE && ${value}`, (): void => {
      expect(and(MAYBE, value)).toBe(
        ((value === FALSE || value === NEVER) && FALSE) || (value === UNDEF ? UNDEF : MAYBE)
      );
    })
  );
  Categories.forEach((value): void =>
    test(`TRUE && ${value}`, (): void => {
      expect(and(TRUE, value)).toBe(value === UNDEF ? UNDEF : value);
    })
  );
});

describe('Categorical OR', (): void => {
  Categories.forEach((value): void =>
    test(`UNDEF || ${value}`, (): void => {
      expect(or(UNDEF, value)).toBe(UNDEF);
    })
  );
  Categories.forEach((value): void =>
    test(`FALSE || ${value}`, (): void => {
      expect(or(FALSE, value)).toBe(value === UNDEF ? UNDEF : value);
    })
  );
  Categories.forEach((value): void =>
    test(`NEVER || ${value}`, (): void => {
      expect(or(NEVER, value)).toBe(
        ((value === TRUE || value === MAYBE) && TRUE) || (value === UNDEF ? UNDEF : NEVER)
      );
    })
  );
  Categories.forEach((value): void =>
    test(`MAYBE || ${value}`, (): void => {
      expect(or(MAYBE, value)).toBe(
        ((value === TRUE || value === NEVER) && TRUE) || (value === UNDEF ? UNDEF : MAYBE)
      );
    })
  );
  Categories.forEach((value): void =>
    test(`TRUE || ${value}`, (): void => {
      expect(or(TRUE, value)).toBe(value === UNDEF ? UNDEF : TRUE);
    })
  );
});
