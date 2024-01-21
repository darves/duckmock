import { ComparisonOperator } from "./comparison-operator.enum";
import { FilterExpressionHolder } from "./filter-exporession-holder.model";
import { FilterExpression, FilterExpressionValueType } from "./filter-expression.model";
import { LogicalOperator } from "./logical-operator.enum";

export class Filter {
  expressions: FilterExpressionHolder[] = [];

  and(expressionParams: FilterExpressionParams): Filter {
    this.addExpression(expressionParams, LogicalOperator.And);

    return this;
  }

  or(expressionParams: FilterExpressionParams): Filter {
    this.addExpression(expressionParams, LogicalOperator.Or);

    return this;
  }

  private addExpression(ep: FilterExpressionParams, operator: LogicalOperator): void {
    const expressionHolder = new FilterExpressionHolder();
    const expression = new FilterExpression(ep.property, ep.operator, ep.value);

    expressionHolder.openBrackets = ep.openBrackets || 0;
    expressionHolder.closedBrackets = ep.closedBrackets || 0;
    expressionHolder.expression = expression;
    expressionHolder.operator = operator;

    this.expressions.push(expressionHolder);
  }
}

interface FilterExpressionParams {
  property: string;
  operator: ComparisonOperator;
  value: FilterExpressionValueType;
  openBrackets?: number;
  closedBrackets?: number;
}