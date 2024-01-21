import { PropertyMockType } from "../core/property-mock-type.enum";
import { AddressMock, addresses } from "../mock-data/data/addresses";
import { randomEmailAddressesArray } from "../mock-data/data/emails";
import { firstNames } from "../mock-data/data/first-names";
import { lastNames } from "../mock-data/data/last-names";
import { ModelMetaData } from "../reflection-helpers/core/model-meta-data.class";
import { MockAdditionalDate, MockAdditionalNumber } from "../reflection-helpers/core/property-meta-data.class";
import { ClassMetaDataHolder } from "../reflection-helpers/core/service/class-meta-data-holder";
import { RepositoryService } from "../repository/repository.service";

export class GeneratorService {
  private static instance: GeneratorService;

  private constructor() {
  }

  public static get Instance() {
    return this.instance || (this.instance = new this());
  }

  generate(modelMetaData: ModelMetaData, count: number, ModelClass?: (new () => any)) {
    const repository = RepositoryService.getInstance(modelMetaData.modelName, modelMetaData.storeKey);
    const result = [];

    for (let i = 0; i < count; i++) {
      const generatedModel = this.generateSingleModel(modelMetaData, ModelClass);

      repository.create(generatedModel as any);
      result.push(generatedModel);
    }

    return result;
  }

  private generateSingleModel(modelMetaData: ModelMetaData, ModelClass?: (new () => any)) {
    let result = ModelClass ? new ModelClass() : {};
    let modelGenerator = new ModelGenerator();

    modelMetaData.properties.forEach((property) => {
      if (property.mockType && typeof (modelGenerator as any)[property.mockType] === 'function') {
        let value = (modelGenerator as any)[property.mockType](property.mockAdditional);

        if (value !== void 0) {
          (result as any)[property.keyName] = value;
        }
      } else if (property.typeOf && typeof property.typeOf === 'function') {
        let subModelMetaData = ClassMetaDataHolder.Instance.get(property.typeOf());

        if (subModelMetaData) {
          (result as any)[property.keyName] = this.generateSingleModel(subModelMetaData as ModelMetaData, property.typeOf());
        }
      } else if (property.arrayTypeOf && typeof property.arrayTypeOf === 'function') {
        let subModelMetaData = ClassMetaDataHolder.Instance.get(property.arrayTypeOf());
        const numberOfItems = 11;

        if (subModelMetaData) {
          (result as any)[property.keyName] = this.generate(subModelMetaData as ModelMetaData, numberOfItems, property.arrayTypeOf());
        }
      }
    });

    return result;
  }
}

/**
 * Model generator class;
 * We have a separated class since there might be some relationship between data on some model (example address);
 */
class ModelGenerator {
  address!: AddressMock;

  [PropertyMockType.FirstName] = () => {
    return this.getRandom(firstNames);
  }

  [PropertyMockType.LastName] = () => {
    return this.getRandom(lastNames);
  }

  [PropertyMockType.Address] = () => {
    return this.returnAddress(PropertyMockType.Address);
  }

  [PropertyMockType.City] = () => {
    return this.returnAddress(PropertyMockType.City);
  }

  [PropertyMockType.Country] = () => {
    return this.returnAddress(PropertyMockType.Country);
  }

  [PropertyMockType.ZipCode] = () => {
    return this.returnAddress(PropertyMockType.ZipCode);
  }

  [PropertyMockType.State] = () => {
    return this.returnAddress(PropertyMockType.State);
  }

  [PropertyMockType.Email] = () => {
    return this.getRandom(randomEmailAddressesArray)
  }

  [PropertyMockType.Number] = (args: MockAdditionalNumber) => {
    return this.getRandomNumber(args.min || 0, args.max || 100000000);
  }

  [PropertyMockType.Date] = (args: MockAdditionalDate) => {
    return this.getRandomDate(args.start, args.end);
  }

  [PropertyMockType.EnumValue] = (enumObject: { [s: number]: string }) => {
    if (!enumObject) {
      throw new Error("Enum values are not provided.");
    }

    return this.getRandom(Object.keys(enumObject)
      .filter((key) => isNaN(Number(key))) // Filter out numeric keys
      .map((key) => {
        return (enumObject as any)[key];
      }));
  }

  [PropertyMockType.Guid] = () => {
    return this.generateGuid();
  }

  private returnAddress(addressProperty: PropertyMockType) {
    if (this.address === void 0) {
      this.address = this.getRandom(addresses);
    }

    if (addressProperty === PropertyMockType.Address) {
      return this.address.Address;
    }

    if (addressProperty === PropertyMockType.City) {
      return this.address.City;
    }

    if (addressProperty === PropertyMockType.State) {
      return this.address.State;
    }

    if (addressProperty === PropertyMockType.Country) {
      return this.address.Country;
    }

    if (addressProperty === PropertyMockType.ZipCode) {
      return this.address.ZipCode;
    }
  }

  private getRandom(collection: Array<any>) {
    return collection[Math.floor(Math.random() * collection.length)];
  }

  private getRandomNumber(min: number, max: number): number {
    if (min >= max) {
      throw new Error("Invalid range. The 'min' value should be less than 'max'.");
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomDate(start: Date | string, end: Date | string = new Date()): Date {
    if (!start) {
      const start = new Date();

      start.setFullYear(start.getFullYear() - 1);
    }

    if (typeof start === "string") {
      start = new Date(start);
    }

    if (typeof end === "string") {
      end = new Date(end);
    }

    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
