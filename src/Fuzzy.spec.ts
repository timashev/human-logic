import { Fuzzy, not, and, or, FUZZY_TRUE, FUZZY_FALSE } from './Fuzzy';

const valueTestStep: Fuzzy = (FUZZY_TRUE - FUZZY_FALSE) / 9;
const value2TestStep: Fuzzy = (FUZZY_TRUE - FUZZY_FALSE) / 13;
const value3TestStep: Fuzzy = (FUZZY_TRUE - FUZZY_FALSE) / 7;

describe('Fuzzy NOT', (): void => {
  // when overflown
  test(`!2`, (): void => {
    expect(not(2)).toEqual(FUZZY_FALSE);
  });
  test(`!-2`, (): void => {
    expect(not(-2)).toEqual(FUZZY_TRUE);
  });
  // normal value
  for (let value: Fuzzy = FUZZY_FALSE; value <= FUZZY_TRUE; value += valueTestStep) {
    test(`!${value.toFixed(3)}`, (): void => {
      expect(not(value)).toBeCloseTo(1.0 - value);
    });
  }
});

describe('Fuzzy AND', (): void => {
  test('&&', (): void => {
    expect(and()).toEqual(FUZZY_TRUE);
  });
  for (let value1: Fuzzy = FUZZY_FALSE; value1 <= FUZZY_TRUE; value1 += valueTestStep) {
    test(`&& ${value1.toFixed(3)}`, (): void => {
      expect(and(value1)).toEqual(value1);
    });
    for (let value2: Fuzzy = FUZZY_FALSE; value2 <= FUZZY_TRUE; value2 += value2TestStep) {
      test(`${value1.toFixed(3)} && ${value2.toFixed(3)}`, (): void => {
        expect(and(value1, value2)).toEqual(value1 < value2 ? value1 : value2);
      });
      for (let value3: Fuzzy = FUZZY_FALSE; value3 <= FUZZY_TRUE; value3 += value3TestStep) {
        test(`${value1.toFixed(3)} && ${value2.toFixed(3)} && ${value3.toFixed(3)}`, (): void => {
          expect(and(value1, value2, value3)).toEqual(Math.min(value1, value2, value3));
        });
      }
    }
  }
});

describe('Fuzzy OR', (): void => {
  test('||', (): void => {
    expect(or()).toEqual(FUZZY_FALSE);
  });
  for (let value1: Fuzzy = FUZZY_FALSE; value1 <= FUZZY_TRUE; value1 += valueTestStep) {
    test(`|| ${value1.toFixed(3)}`, (): void => {
      expect(or(value1)).toEqual(value1);
    });
    for (let value2: Fuzzy = FUZZY_FALSE; value2 <= FUZZY_TRUE; value2 += value2TestStep) {
      test(`${value1.toFixed(3)} || ${value2.toFixed(3)}`, (): void => {
        expect(or(value1, value2)).toEqual(value1 > value2 ? value1 : value2);
      });
      for (let value3: Fuzzy = FUZZY_FALSE; value3 <= FUZZY_TRUE; value3 += value3TestStep) {
        test(`${value1.toFixed(3)} || ${value2.toFixed(3)} || ${value3.toFixed(3)}`, (): void => {
          expect(or(value1, value2, value3)).toEqual(Math.max(value1, value2, value3));
        });
      }
    }
  }
});
