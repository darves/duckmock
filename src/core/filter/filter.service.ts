import { Filter } from "./filter.model";
import { FilterExpressionValueType } from "./filter-expression.model";
import { LogicalOperator } from "./logical-operator.enum";
import { ComparisonOperator } from "./comparison-operator.enum";


/**
 * Filter service used as factory for creating filter objects and serializing them to string;
 * Consider using @rsql/parser (or similar) if we need support for more advanced filters;
 * TODO: Unit test;
 */
export class FilterService {
  private static instance: FilterService;

  private constructor() {
  }

  public static get Instance() {
    return this.instance || (this.instance = new this());
  }

  /**
   * Used for serializing filter object to string (following fiql format);
   * example:
   * Fitler as string in format 'name==John;age=gt=25;(city=="NewYork",city==SanFrancisco'); 
   * -> John with age greater than 25 and city NewYork or SanFrancisco;
   * @param filter 
   * @returns Fitler as string in format 'name==John;age=gt=25;(city=="NewYork",city==SanFrancisco'); -> John with age greater than 25 and city NewYork or SanFrancisco;
   */
  serialise(filter: Filter): string {
    let result = '';

    filter.expressions.forEach((expressionHolder) => {
      const exp = expressionHolder.expression;
      const openBrackets = expressionHolder.openBrackets ? '(' : '';
      const closedBrackets = expressionHolder.closedBrackets ? ')' : '';
      if (exp.value === null) {
        return;
      }
      result = `${!result ? result : (result + expressionHolder.operator)}`;
      result = `${result}${openBrackets}${exp.property}${exp.operator}${this.serialiseValue(exp.value)}${closedBrackets}`
    });

    return result;
  }

  private serialiseValue(val: FilterExpressionValueType): string {
    if (Array.isArray(val)) {
      // maybe we can go here with comma separated values?
      // btw this is for IN operator), we have it on views with multiselect dropdowns;
      val = val.map((item) => {
        return item;
      }) as [];
    } else if (val instanceof Date) {
      return dateToStringConverter(val);
    }

    // TODO Darko: Should we go here with JSON stringfy or not?
    return JSON.stringify(val);
  }

  /**
   * Parses string to filter object;
   * This is fariy simple implementation that does not support nested groups and expressions;
   * But it should be enough for most of the cases we will have in all our applications;
   * @param input string as filter;
   * @returns 
   */
  parse(input: string = ''): Filter {
    let lastOperator = LogicalOperator.And;
    const operators = Object.values(LogicalOperator);
    const filter = new Filter();
    // Depending on if we have () brackets in string we decide on strategy we use
    // for splitting the string and making tokens;
    const splitToGroupsRegEx = /\(|\)/g.test(input) ?
      /(\[[^\]]*\])|(\([^\)]*\))|(;|,)/g : new RegExp(operators.join('|'), 'g');
    let keyAndOperator = '';
    const tokens = input.split(splitToGroupsRegEx).filter(part => !!part) || [];
    tokens.forEach((token) => {
      if (keyAndOperator) {
        token = keyAndOperator + token;
        keyAndOperator = '';
      }
      if (token === LogicalOperator.And || token === LogicalOperator.Or) {
        lastOperator = token;
        return;
      } else if (this.isFilterEndWithArrayOperator(token)) {
        // in this case, token is probably something like 'endDate=IN='
        // that's why we want it to join with next token to get a full :)
        // this can be ofc fixed with regexpression, but I found it a bit complex
        keyAndOperator = token;
      } else if (this.isFilterExpression(token)) {
        this.addFilterExpressionToFilter(token, { filter, lastOperator });
      } else if (this.isGroupToken(token)) {
        this.addExpressionGroupToFilter(token, { filter, lastOperator });
      }
    });
    return filter;
  }

  private addExpressionGroupToFilter(token: string, data: { filter: Filter, lastOperator: LogicalOperator }) {
    let lastOperator = LogicalOperator.And;
    const filter = data.filter;
    const regEx = /(;|,)/g;
    const tokens = token.split(regEx) || [];
    tokens.forEach((token) => {
      if (token === LogicalOperator.And || token === LogicalOperator.Or) {
        lastOperator = token;
        return;
      }
      if (this.isFilterExpression(token)) {
        this.addFilterExpressionToFilter(token, { filter, lastOperator });
      }
    });
  }

  private addFilterExpressionToFilter(token: string, data: { filter: Filter, lastOperator: LogicalOperator }) {
    const expressionOperators = Object.values(ComparisonOperator);
    const regEx = '(' + expressionOperators.join('|') + ')';
    const tokens = token.split(new RegExp(regEx, 'g'));
    const openBrackets = tokens[0].startsWith('(') ? 1 : 0;
    // removing open and closed brackets from begining
    const property = tokens[0].replace(/^[\(\)]+|[\(\)]+$/g, '');
    const operator = tokens[1] as ComparisonOperator;
    const closedBrackets = tokens[2].endsWith(')') ? 1 : 0;
    const valueAsString = tokens[2].replace(/^[\(\)]+|[\(\)]+$/g, '');
    const value = this.parseValue(valueAsString);
    if (data.lastOperator === LogicalOperator.And) {
      data.filter.and({ property, operator, value, closedBrackets, openBrackets });
    } else {
      data.filter.or({ property, operator, value, closedBrackets, openBrackets });
    }
  }

  /**
   * 
   * @param value 
   * @returns 
   */
  private parseValue(value: string) {
    try {
      let result = JSON.parse(value);
      if (Array.isArray(result)) {
        result = result.map((item) => {
          return item;
        });
      }
      return result;
    } catch {
      console.warn('Failed to parse: value');
      return value
    }
  }

  private isGroupToken(token: string) {
    return token.startsWith('(') && token.endsWith(')')
  }

  private isFilterEndWithArrayOperator(token: string) {
    const operators = [ComparisonOperator.In];
    return operators.some((op) => token.endsWith(op));
  }

  private isFilterExpression(token: string) {
    const expressionOperators = Object.values(ComparisonOperator);
    return token.split(new RegExp(expressionOperators.join('|'), 'g')).length === 2;
  }
}

/**
 * TODO: Temporary here;
 * Provide utils functions for data conversion available globaly (or not?!);
 * @param date 
 * @returns 
 */
function dateToStringConverter(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
}