import { ClassMetaDataBase, ClassMetaDataBaseInterface } from "./class-meta-data-base.class";
import { PropertyMetaData } from "./property-meta-data.class";

/**
 * Represents the metadata for a model class.
 * Extends the base class `ClassMetaDataBase` and implements the interface `ModelMetaDataInterface`.
 */
export class ModelMetaData extends ClassMetaDataBase implements ModelMetaDataInterface {
  label!: string;

  constructor() {
    super(ModelMetaData.name);
  }

  /**
   * Retrieves the metadata for the specified target class.
   * @param target - The target class.
   * @returns The metadata for the target class.
   */
  public static getMetaData(target: Function): ModelMetaDataInterface {
    let metaData = ClassMetaDataBase.getClassMetaData(target, ModelMetaData) as ModelMetaData;

    return metaData;
  }

  /**
   * Retrieves the metadata for the specified property of a target class.
   * @param target - The target class.
   * @param propertyKey - The key of the property.
   * @returns The metadata for the specified property.
   */
  public static getPropertyMetaData(target: Function, propertyKey: string): PropertyMetaData {
    let metaDataMap = ClassMetaDataBase.getPropertyMetaData(target, propertyKey, ModelMetaData) as PropertyMetaData;

    return metaDataMap;
  }
}

/**
 * Represents the interface for the model metadata.
 * Extends the base interface `ClassMetaDataBaseInterface`.
 */
export interface ModelMetaDataInterface extends ClassMetaDataBaseInterface {
  label: string;
}