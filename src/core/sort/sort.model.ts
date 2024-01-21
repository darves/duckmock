import { SortDirection } from "./sort-direction.type";

// this will become class probably;
export type Sort<T = any> = {
  [key in keyof T]: SortDirection;
};