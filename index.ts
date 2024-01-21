// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { ControllerModule, RouteGenerator } from "./src/route-generator/route-generator";
import { ClassMetaDataHolder } from "./src/reflection-helpers/core/service/class-meta-data-holder";
import { ModelMetaData } from "./src/reflection-helpers/core/model-meta-data.class";
import { GeneratorService } from "./src/generator/generator-service";
import { GetListParams, RepositoryService } from "./src/repository/repository.service";
import { FilterService } from "./src/core/filter";
import { SortService } from "./src/core/sort/sort.service";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


RouteGenerator.Instance.getAllControllers(__dirname, './controllers').then((controllers: ControllerModule) => {
  Object.keys(controllers).forEach((key) => {
    const controllerConfig = controllers[key];

    Object.keys(controllerConfig.methods).forEach((methodKey) => {
      const methodConfig = controllerConfig.methods[methodKey];
      const modelInfo = ClassMetaDataHolder.Instance.get(methodConfig.model as Function) as ModelMetaData;
      GeneratorService.Instance.generate(modelInfo, 200);
      if (methodKey.toLowerCase().includes('get') && modelInfo) {
        methodKey = methodKey.toLowerCase().replace('get', '');
        methodKey = methodKey.startsWith('/') ? methodKey : `/${methodKey}`;
        app.get(`/${controllerConfig.parentFolder}${methodKey}`, handleGetListRequestWrapper(modelInfo));
        app.get(`/${controllerConfig.parentFolder}${methodKey}/:id`, handleGetSingleRequestWrapper(modelInfo));
      }
    });

  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
});

function handleGetSingleRequestWrapper(info: ModelMetaData) {

  // info.
  return (req: Request, res: Response) => {
    res.send(JSON.stringify(info));
    // res.send(JSON.stringify(methodConfig));
  }
}

function handleGetListRequestWrapper(info: ModelMetaData) {
  const repository = RepositoryService.getInstance(info.modelName, info.storeKey);
  return (req: Request, res: Response) => {
    let data = repository.getList(getListParams(req));

    res.send(JSON.stringify(data));
  }
}

function getListParams(req: Request): GetListParams {
  let result: GetListParams = {};

  if (req.query._filter) {
    result.filter = FilterService.Instance.parse(req.query._filter as string);
  }

  if (req.query._sort) {
    result.sort = SortService.Instance.parse(req.query._sort as string);
    console.log(result.sort);
  }

  result.pagination = {
    page: req.query._page ? +req.query._page : 1,
    size: req.query._size ? +req.query._size : 10
  };

  return result;
}