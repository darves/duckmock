/**
 * Comparison operators for filtering
 * Not all operators are supported by all data types (string, date, number... e.g. 'like' is not supported for numbers)
 */
export enum ComparisonOperator {
  Equal = '==',
  NotEqual = '=ne=',

  like = '=like=',
  // NotLike = '=nlike=',

  GreaterThan = '=gt=',
  GreaterThanOrEqual = '=ge=',
  LessThan = '=lt=',
  LessThanOrEqual = '=le=',

  In = '=in=',
  NotIn = '=out=',

  // this we might need if we want to filter by some property that is type of array;
  // Contains = '=cs=',
  // NotContains = '=ncs=',
}