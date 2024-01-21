import { FilterExpression } from "./filter-expression.model";
import { LogicalOperator } from "./logical-operator.enum";

export class FilterExpressionHolder {
  /**
   * Logical operator that should be applied to this expression
   */
  operator!: LogicalOperator;

  /**
   * Expression that holder holds and provides operator for it together with open/close brackets;
   * @type {FilterExpression}
   */
  expression!: FilterExpression;

  /**
   * Number of open brackets before this expression
   */
  openBrackets: number = 0;

  /**
   * Number of closed brackets before this expression
   */
  closedBrackets: number = 0;

  /**
   * Indicates if this expression is permanent and should not be removed/changed
   * Also it should not be serialized in the application URL.
   * @type {boolean}
   */
  isPermanent: boolean = false;
}