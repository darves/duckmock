import { ModelMetaData } from "./core/model-meta-data.class";

/**
 * Decorator that marks a class as mockable.
 * @param settings Optional settings for the mockable class.
 * @returns A decorator function.
 */
export function Mockable(settings?: any) {
  return function (constructor: Function) {
    let metaData = ModelMetaData.getMetaData(constructor);

    // Add metadata 
    Object.assign(metaData, settings);
  };
}