import { IConstructable } from "../reflection-helpers/core/constructable.interface";
import { MockEndpointType } from "./mock-endpoint-type.enum";

export interface MockEndpointConfig {
  type: MockEndpointType;
  model: IConstructable;
}