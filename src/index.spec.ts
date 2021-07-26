import {
  Category,
  Categories,
  Fuzzy,
  Logic,
  not,
  or,
  and,
  normalize,
  UNDEF,
  FALSE,
  NEVER,
  MAYBE,
  TRUE,
  FUZZY_FALSE,
  FUZZY_TRUE
} from './index';
import { not as dNot, and as dAnd, or as dOr } from './Category';
import { not as fNot, and as fAnd, or as fOr, normalize as fNormalize } from './Fuzzy';
import { not as lNot, and as lAnd, or as lOr, normalize as lNormalize } from './Logic';

describe('Polymorphic Functions', (): void => {
  describe('Category', (): void => {
    Categories.forEach((value): void => {
      test(`not ${value}`, (): void => {
        expect(not(value)).toBe(dNot(value));
      });
      test(`${value} and undefined`, (): void => {
        expect((): Category => and(value, undefined)).toThrow(TypeError);
      });
      test(`undefined and ${value}`, (): void => {
        expect((): Category => and(undefined, value)).toThrow(TypeError);
      });
      test(`${value} or undefined`, (): void => {
        expect((): Category => or(value, undefined)).toThrow(TypeError);
      });
      test(`undefined or ${value}`, (): void => {
        expect((): Category => or(undefined, value)).toThrow(TypeError);
      });
      Categories.forEach((value2): void => {
        test(`${value} and ${value2}`, (): void => {
          expect(and(value, value2)).toBe(dAnd(value, value2));
        });
        test(`${value} or ${value2}`, (): void => {
          expect(or(value, value2)).toBe(dOr(value, value2));
        });
      });
    });
  });

  describe('Fuzzy', (): void => {
    for (let value = FUZZY_FALSE; value <= FUZZY_TRUE; value += 0.1) {
      test(`not ${value}`, (): void => {
        expect(not(value)).toBe(fNot(value));
      });
      for (let value2 = FUZZY_FALSE; value2 <= FUZZY_TRUE; value2 += 0.1) {
        test(`${value} and ${value2}`, (): void => {
          expect(and(value, value2)).toBe(fAnd(value, value2));
        });
        test(`${value} or ${value2}`, (): void => {
          expect(or(value, value2)).toBe(fOr(value, value2));
        });
      }
      const nonNormalizedValue: Fuzzy = 20 * value - 10;
      test(`normalize ${nonNormalizedValue}`, (): void => {
        expect(normalize(nonNormalizedValue)).toEqual(fNormalize(nonNormalizedValue));
      });
    }
  });

  describe('Common Sense', (): void => {
    Categories.forEach((category1): void => {
      const value: Logic = new Logic(
        category1 === UNDEF ? 0.4 : 0.15,
        category1 === FALSE ? 0.4 : 0.15,
        category1 === NEVER ? 0.4 : 0.15,
        category1 === MAYBE ? 0.4 : 0.15,
        category1 === TRUE ? 0.4 : 0.15
      );
      test(`not ${value.toString()}`, (): void => {
        expect(not(value).asArray()).toEqual(lNot(value).asArray());
      });
      Categories.forEach((category2): void => {
        const value2: Logic = new Logic(
          category2 === UNDEF ? 0.4 : 0.15,
          category2 === FALSE ? 0.4 : 0.15,
          category2 === NEVER ? 0.4 : 0.15,
          category2 === MAYBE ? 0.4 : 0.15,
          category2 === TRUE ? 0.4 : 0.15
        );
        test(`${value.toString()} and ${value2.toString()}`, (): void => {
          expect(and(value, value2).asArray()).toEqual(lAnd(value, value2).asArray());
        });
        test(`${value.toString()} or ${value2.toString()}`, (): void => {
          expect(or(value, value2).asArray()).toEqual(lOr(value, value2).asArray());
        });
      });
      const nonNormalizedValue: Logic = new Logic(
        category1 === UNDEF ? 4 : 1.5,
        category1 === FALSE ? 4 : 1.5,
        category1 === NEVER ? 4 : 1.5,
        category1 === MAYBE ? 4 : 1.5,
        category1 === TRUE ? 4 : 1.5
      );
      test(`normalize ${nonNormalizedValue.toString()}`, (): void => {
        expect(normalize(nonNormalizedValue).asArray()).toEqual(lNormalize(nonNormalizedValue).asArray());
      });
    });
  });

  describe('Invalid arguments', (): void => {
    test(`normalize undefined`, (): void => {
      expect((): Fuzzy | Logic => normalize(undefined)).toThrow(TypeError);
    });
    test(`normalize null`, (): void => {
      expect((): Fuzzy | Logic => normalize(null)).toThrow(TypeError);
    });
    test(`not undefined`, (): void => {
      expect((): Category | Fuzzy | Logic => not(undefined)).toThrow(TypeError);
    });
    test(`not null`, (): void => {
      expect((): Category | Fuzzy | Logic => not(null)).toThrow(TypeError);
    });
    test(`undefined and null`, (): void => {
      expect((): Category | Fuzzy | Logic => and(undefined, null)).toThrow(TypeError);
    });
    test(`null and undefined`, (): void => {
      expect((): Category | Fuzzy | Logic => and(null, undefined)).toThrow(TypeError);
    });
    test(`undefined or null`, (): void => {
      expect((): Category | Fuzzy | Logic => or(undefined, null)).toThrow(TypeError);
    });
    test(`null or undefined`, (): void => {
      expect((): Category | Fuzzy | Logic => or(null, undefined)).toThrow(TypeError);
    });
  });
});
