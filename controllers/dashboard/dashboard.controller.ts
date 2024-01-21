import { MockController } from "../../src/core/mock-controller.interface";
import { MockEndpointConfig } from "../../src/core/mock-endpoint-config";
import { MockEndpointType } from "../../src/core/mock-endpoint-type.enum";
import { DashboardUserModel } from "./models";

class DashboardController implements MockController {
  constructor() {
  }
  [methodName: string]: () => MockEndpointConfig;

  get() {
    return {
      model: DashboardUserModel,
      type: MockEndpointType.GetList,
    }
  }
}

export default DashboardController;
