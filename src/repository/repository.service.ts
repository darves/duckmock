import { ComparisonOperator } from "../core/filter/comparison-operator.enum";
import { FilterExpressionHolder } from "../core/filter/filter-exporession-holder.model";
import { FilterExpression } from "../core/filter/filter-expression.model";
import { Filter } from "../core/filter/filter.model";
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
      // result = this.applyFilter(params.filter, result);
      afterFilterCount = result.length
    }

    if (params.sort) {
      // result = this.applySort(params.sort, result);
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

  private applySort(sort: Sort, items: any[]) {
    Object.keys(sort).forEach(key => {
      const sortItem = sort[key];
      items = this.applySortInternal(items, key, sortItem);
    });

    return items;
  }

  private applySortInternal(items: any[], property: string, direction: "asc" | "desc" | undefined) {
    if (!direction) {
      return items;
    }

    return items.sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];

      if (aValue === bValue) {
        return 0;
      }

      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }

      return direction === "asc" ? -1 : 1;
    });

  }

  private applyFilter(filter: Filter, items: any[]) {
    // I want to filter here items by filter object
    return items.map(item => {

    }) || [];
  }

  private applyFilters(items: any[], filterExpressions: FilterExpressionHolder[]): any[] {
    return items;
  }

  private applyFilterExpression(expression: FilterExpression, item: any): boolean {
    const property = expression.property;
    const operator = expression.operator;
    const value = expression.value;
    const objValue = item[property];

    switch (operator) {
      case ComparisonOperator.Equal:
        return objValue === value;
      case ComparisonOperator.NotEqual:
        return objValue !== value;
      // Add more cases for other operators as needed
      default:
        // Handle unsupported operators or throw an error
        return true;
    }
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
