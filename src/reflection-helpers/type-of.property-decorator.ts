import { IConstructable } from "./core/constructable.interface";
import { ModelMetaData } from "./core/model-meta-data.class";

/**
 * Decorator that marks a property as mockable and type of another mockable class.
 * @param typeOf Optional settings for the mockable property.
 * @returns A decorator function.
 */
export function mockableTypeOf(typeOf: () => (new () => any)): Function {
  return (target: IConstructable, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void => {
    let metaData = ModelMetaData.getPropertyMetaData(target.constructor, propertyKey);

    metaData.keyName = propertyKey;

    metaData.typeOf = typeOf;
  };
}