import { MockController } from "../../src/core/mock-controller.interface";
import { MockEndpointConfig } from "../../src/core/mock-endpoint-config";
import { MockEndpointType } from "../../src/core/mock-endpoint-type.enum";
import { PropertyMockType } from "../../src/core/property-mock-type.enum";
import { mockableProperty } from "../../src/reflection-helpers/mockabel-property.property-decorator";
import { Mockable } from "../../src/reflection-helpers/mockable.decorator";

@Mockable()
export class MyClass {
  @mockableProperty({
    mockType: PropertyMockType.Guid
  })
  private message!: string;

  @mockableProperty({
    mockType: PropertyMockType.Number,
    mockAdditional: {
      min: 1,
      max: 1000000
    }
  })
  private count!: number;
}

class OrderController implements MockController {
  constructor() {
  }

  [methodName: string]: () => MockEndpointConfig;

  get(): MockEndpointConfig {
    return {
      model: MyClass,
      type: MockEndpointType.GetList,
    }
  }
}

export default OrderController;