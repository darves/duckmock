import { ClassMetaDataBase } from "../class-meta-data-base.class";

export class ClassMetaDataHolder {
  private static instance: ClassMetaDataHolder;
  private data: Map<Function, ClassMetaDataBase>;

  private constructor() {
    this.data = new Map<Function, ClassMetaDataBase>();
  }

  public static get Instance() {
    return this.instance || (this.instance = new this());
  }

  public get(target: Function): ClassMetaDataBase | undefined {
    return this.data.get(target);
  }

  public set(target: Function, value: Partial<ClassMetaDataBase>) {
    this.data.set(target, value as ClassMetaDataBase);
  }
}