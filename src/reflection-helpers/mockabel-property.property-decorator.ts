import { IConstructable } from "./core/constructable.interface";
import { ModelMetaData } from "./core/model-meta-data.class";
import { PropertyMockType } from "../core/property-mock-type.enum";
import { PropertyMetaData } from "./core/property-meta-data.class";

/**
 * Decorator that marks a property as mockable.
 * @param settings Optional settings for the mockable property.
 * @returns A decorator function.
 */
export function mockableProperty(settings: Pick<PropertyMetaData, 'mockType' | 'mockAdditional'>): Function {
  return (target: IConstructable, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void => {
    let metaData = ModelMetaData.getPropertyMetaData(target.constructor, propertyKey);

    metaData.keyName = propertyKey;
    metaData.mockType = settings.mockType || PropertyMockType.Guid;
    metaData.mockAdditional = settings.mockAdditional;
  };
}