import path from "path";
import fs from "fs";
import { IConstructable } from "../reflection-helpers/core/constructable.interface";
import { MockEndpointConfig } from "../core/mock-endpoint-config";

/**
 * Represents a RouteGenerator that is responsible for generating routes based on controllers.
 */
export class RouteGenerator {
  private controllersFolder = path.join(__dirname, './controllers');
  private static instance: RouteGenerator;

  private constructor() { }

  /**
   * Get the singleton instance of the RouteGenerator class.
   */
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }

  /**
   * Get all the controllers in the specified folder.
   * @param root - The root folder path.
   * @param folder - The folder path relative to the root.
   * @returns A promise that resolves to an object containing all the controllers.
   */
  getAllControllers = async (root: string, folder: string): Promise<ControllerModule> => {
    this.controllersFolder = path.join(root, folder);
    const allControllers = await this.getControllerFilesRecursive(this.controllersFolder);

    // Now we can use the objects defined in the controllers
    Object.keys(allControllers).forEach((key) => {
      const controller = allControllers[key];
      const exampleControllerInstance = new controller.class();

      this.getAllMethods(exampleControllerInstance).forEach((key) => {
        const value = exampleControllerInstance[key]();

        controller.methods = controller.methods || {};
        controller.methods[key] = value;

        // console.log(JSON.stringify(ClassMetaDataHolder.Instance.get(value.model)));
      });
    });

    return allControllers;
  };

  /**
   * Recursively reads controller files from the specified folder path and returns a map of controllers.
   * @param folderPath The path of the folder to start reading controller files from.
   * @returns A map of controllers, where the keys are the controller names and the values are objects containing the controller class and parent folder information.
   */
  private getControllerFilesRecursive = async (folderPath: any) => {
    const controllers: ControllerModule = {};

    const readControllers = async (currentPath: string, parentFolder?: string): Promise<ControllerModule> => {
      try {
        const files: string[] = fs.readdirSync(currentPath);
        for (const file of files) {
          const filePath = path.join(currentPath, file);

          if (fs.statSync(filePath).isDirectory()) {
            // If it's a directory, recursively read controllers from it
            const nestedControllers = await readControllers(filePath, file);
            Object.assign(controllers, nestedControllers);
          } else if (file.endsWith('.controller.ts')) {
            // If it's a file ending with '.controller.ts', dynamically import it
            const controllerName = path.basename(file, '.controller.ts');
            const controllerModule = await import(filePath);

            controllers[controllerName] = {
              class: controllerModule.default || controllerModule,
              parentFolder: parentFolder || '',
              methods: {}
            };
          }
        }
      } catch (error) {
        // Handle errors (e.g., directory not found)
        console.error('Error reading directory:', error);
      }

      return controllers;
    };

    await readControllers(folderPath);

    return controllers;
  }

  /**
   * Retrieves all the method names of a given instance.
   * 
   * @param instance - The instance to retrieve the method names from.
   * @returns An array of method names.
   */
  private getAllMethods(instance: any): string[] {
    const prototype = Object.getPrototypeOf(instance);
    return Object.getOwnPropertyNames(prototype)
      .filter(name => typeof instance[name] === 'function')
      .filter(name => name !== 'constructor');
  }
}



export type ControllerModule = Record<string, ControllerInfo>;
export interface ControllerInfo {
  class: new () => any;
  parentFolder: string;
  methods: Record<string, MockEndpointConfig>;
}

// interface RouteConfig {
//   path: string;
//   model: IConstructable;
// }