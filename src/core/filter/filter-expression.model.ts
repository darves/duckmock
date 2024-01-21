import { ComparisonOperator } from "./comparison-operator.enum";

export class FilterExpression {
  /**
   * Property name that should be used for filtering
   */
  property!: string;

  /**
   * Operator that should be used for filtering
   */
  operator!: ComparisonOperator;

  /**
   * Value that should be used for filtering
   */
  value!: FilterExpressionValueType;

  constructor(property: string, operator: ComparisonOperator, value: FilterExpressionValueType) {
    this.property = property;
    this.operator = operator;
    this.value = value;
  }
}

export type FilterExpressionValueType = string | number | boolean | Date | string[] | number[]