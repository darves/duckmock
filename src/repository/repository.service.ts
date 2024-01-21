import { ComparisonOperator } from "../core/filter/comparison-operator.enum";
import { FilterExpressionHolder } from "../core/filter/filter-exporession-holder.model";
import { FilterExpression } from "../core/filter/filter-expression.model";
import { Filter } from "../core/filter/filter.model";
import { LogicalOperator } from "../core/filter/logical-operator.enum";
import { Pagination } from "../core/pagination/pagination.interface";
import { Sort } from "../core/sort/sort.model";
import { Database } from "../db/db";

export class RepositoryService {
  private static instances: {
    [key: string]: RepositoryService
  } = {};

  db!: BaseModel[];
  private index = 1;

  private constructor(tableName: string) {
    this.db = Database.Instance.getTable(tableName);
  }

  public static getInstance(modelName: string, tableName: string): RepositoryService {
    return this.instances[modelName] || (this.instances[modelName] = new this(tableName));
  }

  public create(item: BaseModel) {
    item.id = this.index++;
    this.db.push(item);
    return item;
  }

  public getList(params: GetListParams) {
    let result = this.db.slice() as any[];
    const totalCount = result.length;
    let afterFilterCount = result.length

    if (params.filter) {
      result = this.applyFilter(result, params.filter);
      afterFilterCount = result.length
    }

    if (params.sort) {
      result = this.applySort(result, params.sort);
    }

    console.log(params)
    if (params.pagination) {
      result = this.applyPagination(params.pagination, result);
    }

    return this.wrapInPagination(result, params.pagination || {}, totalCount, afterFilterCount);
  }

  private wrapInPagination(items: any[], pagination: Pagination, totalCount: number, afterFilterCount: number): GetListResposne {
    return {
      page: pagination.page || 1,
      pageSize: pagination.size || 10,
      count: afterFilterCount,
      totalCount: totalCount,
      items: items
    };
  }

  private applyPagination(pagination: Pagination, items: any[]) {
    const page = pagination.page || 1;
    const perPage = pagination.size || 10;

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    return items.slice(startIndex, endIndex);
  }

  applySort<T = any>(data: T[], sort: Sort<T>): T[] {
    return data.sort((a, b) => {
      for (const key in sort) {
        if (sort[key] !== undefined) {
          if (a[key] < b[key]) {
            return sort[key] === 'asc' ? -1 : 1;
          }
          if (a[key] > b[key]) {
            return sort[key] === 'asc' ? 1 : -1;
          }
        }
      }
      return 0;
    });
  }

  evaluateExpression(model: any, expressionHolder: FilterExpressionHolder): boolean {
    const { property, operator, value } = expressionHolder.expression;
    switch (operator) {
      case ComparisonOperator.Equal:
        return model[property] === value;
      case ComparisonOperator.NotEqual:
        return model[property] !== value;
      case ComparisonOperator.GreaterThan:
        return model[property] > value;
      case ComparisonOperator.GreaterThanOrEqual:
        return model[property] >= value;
      case ComparisonOperator.LessThan:
        return model[property] < value;
      case ComparisonOperator.LessThanOrEqual:
        return model[property] <= value;
      case ComparisonOperator.In:
        return Array.isArray(value) && value.includes(model[property] as never);
      case ComparisonOperator.NotIn:
        return Array.isArray(value) && !value.includes(model[property] as never);
      case ComparisonOperator.Like:
        return typeof model[property] === 'string' && model[property].includes(value);
      case ComparisonOperator.NotLike:
        return typeof model[property] === 'string' && !model[property].includes(value);
      // Add cases for other operators...
      default:
        return true;
    }
  }
  
  // Function to apply the filter to the array
  applyFilter(data: any[], filter: Filter): any[] {
    return data.filter(item => {
      let result = this.evaluateExpression(item, filter.expressions[0]);

      for (let i = 1; i < filter.expressions.length; i++) {
        const expressionHolder = filter.expressions[i];
        if (expressionHolder.operator === LogicalOperator.And) {
          result = result && this.evaluateExpression(item, expressionHolder);
        } else if (expressionHolder.operator === LogicalOperator.Or) {
          result = result || this.evaluateExpression(item, expressionHolder);
        }
      }

      return result;
    });
  }
}

export interface GetListParams {
  filter?: Filter;
  sort?: Sort;
  pagination?: Pagination;
}

interface BaseModel {
  id: number;
}

export interface GetListResposne<T = any> {
  page: number;
  count: number;
  pageSize: number;

  // Without filter appllied
  totalCount: number;
  items: T[];
}
