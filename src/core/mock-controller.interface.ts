import { MockEndpointConfig } from "./mock-endpoint-config";

export interface MockController {
  [methodName: string]: () => MockEndpointConfig;
}