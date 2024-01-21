import { IConstructable } from "./core/constructable.interface";
import { ModelMetaData } from "./core/model-meta-data.class";
import { PropertyMetaData } from "./core/class-meta-data-base.class";

/**
 * Decorator that marks a property as mockable and type array of another mockable class.
 * @param settings Optional settings for the mockable property.
 * @returns A decorator function.
 */
export function mockableArrayTypeOf(settings: () => (new () => any)): Function {
  return (target: IConstructable, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void => {
    let metaData = ModelMetaData.getPropertyMetaData(target.constructor, propertyKey);

    metaData.keyName = propertyKey;

    metaData.arrayTypeOf = settings;
  };
}