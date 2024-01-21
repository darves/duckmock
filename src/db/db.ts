export class Database {
  private static instance: Database;
  private db: Map<string, any[]>;

  private constructor() {
    this.db = new Map();
  }

  public static get Instance() {
    return this.instance || (this.instance = new this());
  }

  getTable(tableName: string) {
    // console.log("getTable", tableName);
    let table = this.db.get(tableName);

    if (!table) {
      table = [];
      this.db.set(tableName, table);
    }

    return table;
  }
}