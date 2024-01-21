export enum MockEndpointType {
  /**
   * Getting single item endpoint will be mocked;
   * Endpoint will expect id as a parameter {{mockServerUrl}}/{{endpoint}}/:id
   */
  GetSingle = "GetSingle",

  /**
   * Getting list of items endpoint will be mocked;
   * Endpoint will expect query parameters {{mockServerUrl}}/{{endpoint}}?_page=1&_limit=10&_sort=id&_filter
   */
  GetList = "GetList",

  /**
   * TO BE DEFINED
   */
  CreateNOTSUPPORTED = "Create",

  /**
   * TO BE DEFINED
   */
  UpdateNOTSUPPORTED = "Update",
}