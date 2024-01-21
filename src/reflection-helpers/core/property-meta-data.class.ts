import { PropertyMockType } from "../../core/property-mock-type.enum";

/**
 * Represents the metadata for a property.
 */
export class PropertyMetaData {
  /**
   * The key name of the property.
   */
  keyName!: string;
  /**
   * The mock type of the property.
   */
  mockType!: PropertyMockType;
  /**
   * Additional mock data for the property.
   * Can be of type MockAdditionalNumber, MockAdditionalDate, or an object with number keys and string values.
   */
  mockAdditional?: MockAdditionalNumber | MockAdditionalDate | { [s: number]: string };

  /**
   * The type of the property.
   */
  typeOf?: () => (new () => any);

  /**
   * The array type of the property.
   */
  arrayTypeOf?: () => (new () => any);
}

/**
 * Represents additional mock data for a number property.
 */
export interface MockAdditionalNumber {
  min: number;
  max: number;
}

/**
 * Represents additional mock data for a date property.
 */
export interface MockAdditionalDate {
  start: string;
  end: string;
}
