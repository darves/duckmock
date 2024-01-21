import { ModelMetaData } from "../reflection-helpers/core/model-meta-data.class";

export class SwaggerGenerator {
  private static instance: SwaggerGenerator;

  private swaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'DUCKMOCK - Dynamic Mock API Documentation',
      version: '1.0.0',
      description: 'API documentation generated dynamically based on model metadata',
    },
    paths: {},
    components: {
      schemas: {}
    },
  };

  private constructor() {

  }

  public static get Instance() {
    return this.instance || (this.instance = new this());
  }

  getSwaggerSpec() {
    return this.swaggerSpec;
  }

  addSwagger(modelMetaData: ModelMetaData, path: string) {
    (this.swaggerSpec.components.schemas as any)[modelMetaData.modelName] = this.createSwaggerSchemaForModel(modelMetaData);

    // Generate paths - adjust this as per your API's design
    path = path ?? `/${modelMetaData.modelName.toLowerCase()}`;
    (this.swaggerSpec.paths as any)[path] = {
      get: {
        summary: `Get a list of ${modelMetaData.modelName}`,
        responses: {
          '200': {
            description: `A list of ${modelMetaData.modelName}`,
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: `#/components/schemas/${modelMetaData.modelName}` }
                }
              }
            }
          }
        }
      }
    };
  }

  private createSwaggerSchemaForModel(modelMetaData: ModelMetaData) {
    const schema = { type: 'object', properties: {} };
    modelMetaData.properties.forEach(prop => {
      (schema.properties as any)[prop.keyName] = { type: prop.type || 'string' }; 
    });
    return schema;
  }

}