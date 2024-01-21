import { SortDirection } from "./sort-direction.type";
import { Sort } from "./sort.model";

export class SortService {
  private static instance: SortService;

  private constructor() {
  }

  public static get Instance() {
    return this.instance || (this.instance = new this());
  }

  public parse<T = any>(sortString: string): Sort<T> {
    const sort: Sort<T> = {} as Sort<T>;
    const sortDirectives = sortString.split(',');
  
    for (const directive of sortDirectives) {
      const [property, direction] = directive.trim().split(' ');
      if (property && direction) {
        sort[property as keyof T] = direction as SortDirection;
      }
    }
  
    return sort;
  }
}
