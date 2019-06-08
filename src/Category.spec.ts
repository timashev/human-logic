import { Category, Categories, not, and, or, UNDEF, FALSE, NEVER, MAYBE, TRUE } from './Category';

describe('Categorical NOT', (): void => {
  test('!UNDEF', (): void => {
    expect(Category[not(UNDEF)]).toBe(Category[UNDEF]);
  });
  test('!FALSE', (): void => {
    expect(Category[not(FALSE)]).toBe(Category[TRUE]);
  });
  test('!NEVER', (): void => {
    expect(Category[not(NEVER)]).toBe(Category[MAYBE]);
  });
  test('!MAYBE', (): void => {
    expect(Category[not(MAYBE)]).toBe(Category[NEVER]);
  });
  test('!TRUE', (): void => {
    expect(Category[not(TRUE)]).toBe(Category[FALSE]);
  });
});

describe('Categorical AND', (): void => {
  Categories.forEach((value): void =>
    test(`UNDEF && ${Category[value]}`, (): void => {
      expect(Category[and(UNDEF, value)]).toBe(Category[UNDEF]);
    })
  );
  Categories.forEach((value): void =>
    test(`FALSE && ${Category[value]}`, (): void => {
      expect(Category[and(FALSE, value)]).toBe(Category[value === UNDEF ? UNDEF : FALSE]);
    })
  );
  Categories.forEach((value): void =>
    test(`NEVER && ${Category[value]}`, (): void => {
      expect(Category[and(NEVER, value)]).toBe(
        Category[((value === FALSE || value === MAYBE) && FALSE) || (value === UNDEF ? UNDEF : NEVER)]
      );
    })
  );
  Categories.forEach((value): void =>
    test(`MAYBE && ${Category[value]}`, (): void => {
      expect(Category[and(MAYBE, value)]).toBe(
        Category[((value === FALSE || value === NEVER) && FALSE) || (value === UNDEF ? UNDEF : MAYBE)]
      );
    })
  );
  Categories.forEach((value): void =>
    test(`TRUE && ${Category[value]}`, (): void => {
      expect(Category[and(TRUE, value)]).toBe(Category[value === UNDEF ? UNDEF : value]);
    })
  );
});

describe('Categorical OR', (): void => {
  Categories.forEach((value): void =>
    test(`UNDEF || ${Category[value]}`, (): void => {
      expect(Category[or(UNDEF, value)]).toBe(Category[UNDEF]);
    })
  );
  Categories.forEach((value): void =>
    test(`FALSE || ${Category[value]}`, (): void => {
      expect(Category[or(FALSE, value)]).toBe(Category[value === UNDEF ? UNDEF : value]);
    })
  );
  Categories.forEach((value): void =>
    test(`NEVER || ${Category[value]}`, (): void => {
      expect(Category[or(NEVER, value)]).toBe(
        Category[((value === TRUE || value === MAYBE) && TRUE) || (value === UNDEF ? UNDEF : NEVER)]
      );
    })
  );
  Categories.forEach((value): void =>
    test(`MAYBE || ${Category[value]}`, (): void => {
      expect(Category[or(MAYBE, value)]).toBe(
        Category[((value === TRUE || value === NEVER) && TRUE) || (value === UNDEF ? UNDEF : MAYBE)]
      );
    })
  );
  Categories.forEach((value): void =>
    test(`TRUE || ${Category[value]}`, (): void => {
      expect(Category[or(TRUE, value)]).toBe(Category[value === UNDEF ? UNDEF : TRUE]);
    })
  );
});
