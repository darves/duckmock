import { PropertyMetaData } from "./property-meta-data.class";
import { ClassMetaDataHolder } from "./service/class-meta-data-holder";

const classMetaDataHolder = ClassMetaDataHolder.Instance;

/**
 * Represents the interface for the base class metadata.
 */
export interface ClassMetaDataBaseInterface {
  modelName: string;
  name: string;
  properties: PropertyMetaData[];
}

/**
 * Represents the base class for class metadata.
 */
export abstract class ClassMetaDataBase implements ClassMetaDataBaseInterface {
  public modelName!: string;

  public name!: string;
  public target!: { new(): ClassMetaDataBase };
  /**
   * The key used to store the class data in memory DB.
   */
  public storeKey!: string;
  properties: PropertyMetaData[] = [];

  /**
   * Creates an instance of ClassMetaDataBase.
   * @param name The name of the class metadata.
   * @param target The target class for the metadata.
   */
  constructor(name: string = "base", target?: { new(): ClassMetaDataBase }) {
    this.name = name;

    // this.storeKey = `$table_${this.modelName}`;
    // console.log(this.storeKey);

    if (target !== void 0) {
      this.target = target;
    }
  }

  /**
   * Gets the class metadata for the given target class.
   * This can be extended to support multiple class metadata.
   * @param target The target class.
   * @param constructor The constructor function for the class metadata.
   * @returns The class metadata.
   */
  protected static getClassMetaData(
    target: Function,
    constructor: { new(n: string, target: Function): ClassMetaDataBase }
  ): ClassMetaDataBase {
    let metaData: Partial<ClassMetaDataBase> | undefined = classMetaDataHolder.get(target);
    let name = constructor.name;

    if (metaData === void 0) {
      metaData = new constructor(name, constructor);
      classMetaDataHolder.set(target, metaData);
    }

    // In case we want to store multiple class meta data we can do that (In case we have multiple class decorators)
    // To keep it simple in first phase, we introduce just single class meta data
    // for (let i = 0; i < metaDataList.length; i++) {
    //   if (metaDataList[i].name === name) {
    //     return metaDataList[i];
    //   }
    // }

    Object.assign(metaData, {
      modelName: target.name,
      storeKey: `$table_${target.name}`
    });
    return metaData as ClassMetaDataBase;
  }

  /**
   * Gets the property metadata for the given target class and property name.
   * @param target The target class.
   * @param propertyName The name of the property.
   * @param constructor The constructor function for the class metadata.
   * @returns The property metadata.
   */
  public static getPropertyMetaData(target: Function, propertyName: string, constructor: { new(n: string): ClassMetaDataBase }
  ): PropertyMetaData {
    const classMetaData = ClassMetaDataBase.getClassMetaData(target, constructor);

    for (let i = 0; i < classMetaData.properties.length; i++) {
      if (classMetaData.properties[i].keyName === propertyName) {
        return classMetaData.properties[i];
      }
    }

    classMetaData.properties.push(new PropertyMetaData());
    return classMetaData.properties[classMetaData.properties.length - 1];
  }
}

/**
 * Represents the metadata for a class property.
 */
// export class PropertyMetaData {
//   keyName!: string;
//   mockType?: PropertyMockType;
//   mockAdditional?: MockAdditionalNumber | MockAdditionalDate | { [s: number]: string };

//   typeOf?: () => (new () => any);
//   arrayTypeOf?: () => (new () => any);
// }

// /**
//  * Represents additional metadata for a number property.
//  */
// export interface MockAdditionalNumber {
//   min: number;
//   max: number;
// }

// /**
//  * Represents additional metadata for a date property.
//  */
// export interface MockAdditionalDate {
//   start: string;
//   end: string;
// }
