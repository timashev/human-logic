import { Logic, normalize as lNormalize, not as lNot, and as lAnd, or as lOr } from './Logic';
import { Fuzzy, FUZZY_TRUE, FUZZY_FALSE } from './Fuzzy';
import { Category, Categories, not, and, or, UNDEF, FALSE, NEVER, MAYBE, TRUE } from './Category';

const testStep: Fuzzy[] = [
  (FUZZY_TRUE - FUZZY_FALSE) / 2.1,
  (FUZZY_TRUE - FUZZY_FALSE) / 2.2,
  (FUZZY_TRUE - FUZZY_FALSE) / 2.3,
  (FUZZY_TRUE - FUZZY_FALSE) / 2.4,
  (FUZZY_TRUE - FUZZY_FALSE) / 2.5
];

describe('Common Sense', (): void => {
  describe('constructors', (): void => {
    Categories.forEach((category): void => {
      test(`fromCategory(${category})`, (): void => {
        expect(Logic.fromCategory(category).asArray()).toEqual([
          category === UNDEF ? FUZZY_TRUE : FUZZY_FALSE,
          category === FALSE ? FUZZY_TRUE : FUZZY_FALSE,
          category === NEVER ? FUZZY_TRUE : FUZZY_FALSE,
          category === MAYBE ? FUZZY_TRUE : FUZZY_FALSE,
          category === TRUE ? FUZZY_TRUE : FUZZY_FALSE
        ]);
      });
    });
  });

  describe('unary operators', (): void => {
    test(`not undefined`, (): void => {
      expect((): Logic => lNot(undefined)).toThrow(TypeError);
    });
    test(`normalize undefined`, (): void => {
      expect((): Logic => lNormalize(undefined)).toThrow(TypeError);
    });
    for (let _undef: Fuzzy = FUZZY_FALSE; _undef <= FUZZY_TRUE; _undef += testStep[UNDEF]) {
      for (let _false: Fuzzy = FUZZY_FALSE; _false <= FUZZY_TRUE; _false += testStep[FALSE]) {
        for (let _never: Fuzzy = FUZZY_FALSE; _never <= FUZZY_TRUE; _never += testStep[NEVER]) {
          for (let _maybe: Fuzzy = FUZZY_FALSE; _maybe <= FUZZY_TRUE; _maybe += testStep[MAYBE]) {
            for (let _true: Fuzzy = FUZZY_FALSE; _true <= FUZZY_TRUE; _true += testStep[TRUE]) {
              // scalar
              const scalar = _undef + _false + _never + _maybe + _true;
              // normalization divisor
              const sum = scalar <= 0.0 ? 1.0 : scalar;
              // Logic value to test
              const value: Logic = new Logic(
                _undef / sum,
                _false / sum,
                _never / sum,
                _maybe / sum,
                _true / sum
              );

              // value validity check
              test(`is ${value.toString()} valid?`, (): void => {
                expect(value.isValid()).toBe(scalar > 0);
              });

              // constructors
              test(`fromArray ${value.toString()}`, (): void => {
                const values = Logic.fromArray([
                  _undef / sum,
                  _false / sum,
                  _never / sum,
                  _maybe / sum,
                  _true / sum
                ]).asValues();
                expect(values.UNDEF).toBeCloseTo(_undef / sum);
                expect(values.FALSE).toBeCloseTo(_false / sum);
                expect(values.NEVER).toBeCloseTo(_never / sum);
                expect(values.MAYBE).toBeCloseTo(_maybe / sum);
                expect(values.TRUE).toBeCloseTo(_true / sum);
              });
              test(`fromValues ${value.toString()}`, (): void => {
                const values = Logic.fromValues({
                  UNDEF: _undef / sum,
                  FALSE: _false / sum,
                  NEVER: _never / sum,
                  MAYBE: _maybe / sum,
                  TRUE: _true / sum
                }).asValues();
                expect(values[UNDEF]).toBeCloseTo(_undef / sum);
                expect(values[FALSE]).toBeCloseTo(_false / sum);
                expect(values[NEVER]).toBeCloseTo(_never / sum);
                expect(values[MAYBE]).toBeCloseTo(_maybe / sum);
                expect(values[TRUE]).toBeCloseTo(_true / sum);
              });

              // dominating category of tested value
              const _max = Math.max(_undef, _false, _never, _maybe, _true);
              let category: Category;
              if (_max === _undef) category = UNDEF;
              else if (_max === _false) category = FALSE;
              else if (_max === _never) category = NEVER;
              else if (_max === _maybe) category = MAYBE;
              else if (_max === _true) category = TRUE;

              test(`!${value.toString()}`, (): void => {
                const values = value.not().asValues();
                expect(values[UNDEF]).toBeCloseTo(_undef / sum);
                expect(values[FALSE]).toBeCloseTo(_true / sum);
                expect(values[NEVER]).toBeCloseTo(_maybe / sum);
                expect(values[MAYBE]).toBeCloseTo(_never / sum);
                expect(values[TRUE]).toBeCloseTo(_false / sum);
              });

              test(`!${value.toString()} as category`, (): void => {
                expect(value.not().asCategory()).toBe(value.isValid() ? not(category) : undefined);
              });

              test(`normalized ${value.toString()}`, (): void => {
                const testValue = value.normalize();
                expect(testValue.get(UNDEF)).toBeCloseTo(_undef / sum);
                expect(testValue.get(FALSE)).toBeCloseTo(_false / sum);
                expect(testValue.get(NEVER)).toBeCloseTo(_never / sum);
                expect(testValue.get(MAYBE)).toBeCloseTo(_maybe / sum);
                expect(testValue.get(TRUE)).toBeCloseTo(_true / sum);
              });

              test(`normalized values of ${value.toString()}`, (): void => {
                expect(value.getNormalized(UNDEF)).toBeCloseTo(_undef / sum);
                expect(value.getNormalized(FALSE)).toBeCloseTo(_false / sum);
                expect(value.getNormalized(NEVER)).toBeCloseTo(_never / sum);
                expect(value.getNormalized(MAYBE)).toBeCloseTo(_maybe / sum);
                expect(value.getNormalized(TRUE)).toBeCloseTo(_true / sum);
              });

              test(`category of ${value.toString()}`, (): void => {
                expect(value.asCategory()).toBe(value.isValid() ? category : undefined);
              });

              Categories.forEach((cat): void => {
                test(`${value.toString()} eq ${cat}`, (): void => {
                  expect(value.eq(cat)).toBe(category === cat && value.isValid());
                });
                test(`${value.toString()} ne ${cat}`, (): void => {
                  expect(value.ne(cat)).toBe(category !== cat || !value.isValid());
                });
              });
            }
          }
        }
      }
    }
  });

  describe('binary operators', (): void => {
    Categories.forEach((category1): void => {
      const value1: Logic = new Logic(
        category1 === UNDEF ? 0.4 : 0.15,
        category1 === FALSE ? 0.4 : 0.15,
        category1 === NEVER ? 0.4 : 0.15,
        category1 === MAYBE ? 0.4 : 0.15,
        category1 === TRUE ? 0.4 : 0.15
      );

      describe('Invalid arguments', (): void => {
        test(`${value1}.and(undefined)`, (): void => {
          expect((): Logic => value1.and(undefined)).toThrow(TypeError);
        });
        test(`${value1} and undefined`, (): void => {
          expect((): Logic => lAnd(value1, undefined)).toThrow(TypeError);
        });
        test(`undefined and ${value1}`, (): void => {
          expect((): Logic => lAnd(undefined, value1)).toThrow(TypeError);
        });
        test(`${value1}.or(undefined)`, (): void => {
          expect((): Logic => value1.or(undefined)).toThrow(TypeError);
        });
        test(`${value1} or undefined`, (): void => {
          expect((): Logic => lOr(value1, undefined)).toThrow(TypeError);
        });
        test(`undefined or ${value1}`, (): void => {
          expect((): Logic => lOr(undefined, value1)).toThrow(TypeError);
        });
        test(`${value1}.add(undefined)`, (): void => {
          expect((): Logic => value1.add(undefined)).toThrow(TypeError);
        });
      });

      Categories.forEach((category2): void => {
        const value2: Logic = new Logic(
          category2 === UNDEF ? 0.4 : 0.15,
          category2 === FALSE ? 0.4 : 0.15,
          category2 === NEVER ? 0.4 : 0.15,
          category2 === MAYBE ? 0.4 : 0.15,
          category2 === TRUE ? 0.4 : 0.15
        );

        test(`${value1.toString()} && ${value2.toString()}`, (): void => {
          expect(value1.and(value2).asCategory()).toBe(and(category1, category2));
        });

        test(`${value1.toString()} || ${value2.toString()}`, (): void => {
          expect(value1.or(value2).asCategory()).toBe(or(category1, category2));
        });

        test(`${value1.toString()} + ${value2.toString()}`, (): void => {
          const testValue = value1.clone().add(value2);
          expect(testValue.get(UNDEF)).toBeCloseTo(
            (category1 === UNDEF ? 0.4 : 0.15) + (category2 === UNDEF ? 0.4 : 0.15)
          );
          expect(testValue.get(FALSE)).toBeCloseTo(
            (category1 === FALSE ? 0.4 : 0.15) + (category2 === FALSE ? 0.4 : 0.15)
          );
          expect(testValue.get(NEVER)).toBeCloseTo(
            (category1 === NEVER ? 0.4 : 0.15) + (category2 === NEVER ? 0.4 : 0.15)
          );
          expect(testValue.get(MAYBE)).toBeCloseTo(
            (category1 === MAYBE ? 0.4 : 0.15) + (category2 === MAYBE ? 0.4 : 0.15)
          );
          expect(testValue.get(TRUE)).toBeCloseTo(
            (category1 === TRUE ? 0.4 : 0.15) + (category2 === TRUE ? 0.4 : 0.15)
          );
        });
      });
    });
  });
});
